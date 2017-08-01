// inside function to post votes, save watson data to elasticsearch

const express = require('express');
const router = express.Router();

const db = require('../db/index.js');
const utils = require('../utils.js');

const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const elasticsearch = require('elasticsearch');
const watsonConfig = require('./watson-config.js');

const username = watsonConfig.username;
const password = watsonConfig.password;

const nlu = new NaturalLanguageUnderstandingV1({
  username: username,
  password: password,
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27,
});

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'error'
});

const getFromWatson = (url, callback) => {
  nlu.analyze({
  'url': url,
  'features': {
    'categories' : {},
    'metadata': {}
  },
  'return_analyzed_text': true
}, (err, response) => {
    callback(err, response);
 });
};

// body => {title: 'title', text: 'text', categories: 'categories'}

const saveToElasticsearch = (index, type, id, body, callback) => {
  client.index({
    index: index,
    type: type,
    id: id,
    body: body
  }, (error, response) => {
      callback(err, response);
  });
};

router.post('/', (req, res, next) => {
  let url = req.body.url;
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username || req.session.username;
  let typeCount = `${type}Count`;

  if (urlId !== null) {
    db.Url.findOne({where: {id: urlId}})
    .then(url => {
      return db.User.findCreateFind({where: {username: username}})
      .spread(user => {
        db.UrlVote.create({type: type, userId: user.id, urlId: url.id})
        .then(() => {
          db.User.increment(typeCount, {where: {id: user.id}});
          db.Url.increment(typeCount, {where: {id: url.id}});
          res.status(201).json(url.id);
        })
        .catch(err => {
          res.sendStatus(400);
        });
      })
      .catch(err => {
        res.sendStatus(400);
      });
    })
    .catch(err => {
      res.sendStatus(400);
    });
  } else if (urlId === null) {
    db.Url.findCreateFind({where: {'url': url}})
    .spread(url => {
      getFromWatson(url.url, (err, data) => {
        if (err) {
          console.error(err);
          return db.Url.increment(typeCount, {where: {id: url.id}})
                .then(() => {
                  return db.User.findCreateFind({where: {username: username}})
                    .spread(user => {
                      db.UrlVote.create({type: type, userId: user.id, urlId: url.id})
                        .then(() => {
                          db.User.increment(typeCount, {where: {id: user.id}});
                          res.status(201).json(url.id);
                          url.update({categoryId: category.id, title: title})
                            .catch((err) => {
                              console.error(err);
                            });
                        }).catch(err => {
                          res.sendStatus(400);
                        });
                    }).catch(err => {
                      res.sendStatus(400);
                    });
                }).catch(err => {
                res.sendStatus(400);
              });
        } else {
          let title = data.metadata.title;
          categories = [];
          for (let x of data.categories) {
            categories.push(x.label.slice(1));
          }
          let category = categories.join(' ');
          db.Category.findCreateFind({where: {name: category}})
            .spread((category) => {
              return db.Url.increment(typeCount, {where: {id: url.id}})
                .then(() => {
                  return db.User.findCreateFind({where: {username: username}})
                    .spread(user => {
                      db.UrlVote.create({type: type, userId: user.id, urlId: url.id})
                        .then(() => {
                          db.User.increment(typeCount, {where: {id: user.id}});
                          res.status(201).json(url.id);
                          url.update({categoryId: category.id, title: title})
                            .catch((err) => {
                              console.error(err);
                            });
                        }).catch(err => {
                          res.sendStatus(400);
                        });
                    }).catch(err => {
                      res.sendStatus(400);
                    });
                }).catch(err => {
                res.sendStatus(400);
              });
            });
        }
      });
    });
   }
});



router.put('/', (req, res, next) => {
  let url = req.body.url;
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username || req.session.username;
  let typeCount = `${type}Count`;
  db.Url.findOne({where: {id: urlId}})
  .then(urlEntry => {
    return db.User.findOne({where: {username: username}})
    .then(userEntry => {
      return db.UrlVote.findOne({where: {userId: userEntry.id, urlId: urlEntry.id}})
      .then(voteEntry => {
        let oldTypeCount = `${voteEntry.type}Count`;
        let oldType = voteEntry.type;
        userEntry.decrement(oldTypeCount);
        urlEntry.decrement(oldTypeCount);
        userEntry.increment(typeCount);
        urlEntry.increment(typeCount)
        .then(() => {
          db.UrlVote.update({type: type}, {where: {userId: userEntry.id, urlId: urlEntry.id}});
          res.status(201).json(urlEntry.id);
        });
      });
    });
  });
});

router.get('/:urlId', (req, res, next) => {
  let urlId = req.params.urlId;
  db.Url.findOne({where: {id: urlId}})
  .then(urlEntry => {
    let rating = utils.calculateRating(urlEntry.upvoteCount, urlEntry.downvoteCount);
    res.json(rating);
  })
  .catch(err => {
    console.error('error getting URL votes: ', err);
    res.sendStatus(500);
  });
});

router.delete('/', (req, res, next) => {
  let urlId = req.query.urlId;
  let type = req.query.type;
  let username = req.query.username;
  let typeCount = `${type}Count`;

  db.Url.findOne({'where': {'id': urlId}})
  .then(urlEntry => {
    return db.User.findOne({'where': {'username': username}})
    .then(userEntry => {
      return db.UrlVote.findOne({'where': {'userId': userEntry.id, 'urlId': urlEntry.id}})
      .then(voteEntry => {
        userEntry.decrement(typeCount);
        urlEntry.decrement(typeCount);
        voteEntry.destroy();
        res.status(201).json(urlEntry.id);
      });
    });
  });
});

module.exports = router;
