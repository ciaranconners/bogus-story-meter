const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const watsonConfig = require('./watson-config.js');

const username = watsonConfig.username;
const password = watsonConfig.password;

const nlu = new NaturalLanguageUnderstandingV1({
  username: username,
  password: password,
  version_date: NaturalLanguageUnderstandingV1.VERSION_DATE_2017_02_27
});

const getFromWatson = (url, callback) => {
  nlu.analyze(
    {
      url: url,
      features: {
        categories: {},
        metadata: {}
      },
      return_analyzed_text: true
    },
    (err, response) => {
      callback(err, response);
    }
  );
};

router.post('/', (req, res, next) => {
  console.log('session username: ', req.session.username);
  let url = req.body.url;
  let urlId = req.body.urlId;
  let username = req.body.username || req.session.username;
  let comment = req.body.comment;
  let commentId = req.body.commentId || null;
  if (urlId !== null) {
    db.User
      .findCreateFind({where: {username: username}})
      .spread(user => {
        return db.Comment.create({
          text: comment,
          commentId: commentId,
          urlId: urlId,
          userId: user.id
        });
      })
      .then(comment => {
        res.sendStatus(201);
      })
      .catch(err => {
        res.sendStatus(400);
      });
  } else if (urlId === null) {
    db.Url
      .findCreateFind({where: {url: url}})
      .spread(url => {
        return db.User
          .findCreateFind({
            where: {
              username: username
            }
          })
          .spread(user => {
            db.Comment.create({
              text: comment,
              commentId: null,
              urlId: url.id,
              userId: user.id
            });
            res.status(201).json(url.id);
            getFromWatson(url.url, (err, data) => {
              let title = data.metadata.title;
              let text = data.analyzed_text;
              categories = [];
              for (let x of data.categories) {
                categories.push(x.label.slice(1));
              }
              let category = categories.join(' ');
              db.Category
                .findCreateFind({
                  where: {
                    name: category
                  }
                })
                .spread(category => {
                  url.update({categoryId: category.id, title: title});
                })
                .catch(err => {
                  console.error(err);
                });
            });
          })
          .catch(err => {
            res.sendStatus(400);
          });
      })
      .catch(err => {
        res.sendStatus(400);
      });
  }
});

module.exports = router;
