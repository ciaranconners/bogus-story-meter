const db = require('./db/index.js');


const handler = {};

/* gets rating for url
- responds with NaN if the site is in the db but never voted on,
- errors if url is not in db,
- otherwise responds with the url's rating from 0 - 100
*/

// handler.getUrlRating = (req, res) => {
//   let url = req.query.currentUrl;
//   db.Url.findOne({where: {url: url}})
//     .then(url => {
//       if (url) {
//         let upvotes = url.upvoteCount;
//         let downvotes = url.downvoteCount;
//         let rating = Math.round((upvotes / (upvotes + downvotes)) * 100);
//         res.json( {'rating': rating, 'urlId': url.id} );
//       } else { res.json( {'rating': null, 'urlId': null} ); }
//     })
//     .catch((err) => {
//       console.log(`error retrieving rating for ${url}`);
//       console.error(err);
//       res.sendStatus(500);
//     });
// };

handler.getUrlData = (req, res) => {
  let url = req.query.currentUrl;
  let username = req.query.currentUser;

  db.User.findCreateFind( {where: {'username': username}} )
  .spread((userEntry) => {
    return db.Url.findOne( {where: {'url': url}} )
    .then((urlEntry) => {
      if(urlEntry === null) {
        res.json( {
          'rating': null,
          'urlId': null,
          'userId': userEntry.id,
          'userVote': null
        })
      } else {
        return db.UrlVote.findOne( {where: {'userId': userEntry.id, 'urlId': urlEntry.id}} )
        .then((voteEntry) => {
          let upvotes = urlEntry.upvoteCount;
          let downvotes = urlEntry.downvoteCount;
          rating = Math.round((upvotes / (upvotes + downvotes)) * 100);
          if(voteEntry) {
            res.json( {
              'rating': rating,
              'urlId': urlEntry.id,
              'userId': userEntry.id,
              'userVote': voteEntry.type
            })
          } else {
            res.json( {
              'rating': null,
              'urlId': urlEntry.id,
              'userId': userEntry.id,
              'userVote': null
            })
          }
        })
      }
    })
  })

}

handler.getUrlVotes = (req, res) => {
  let urlId = req.params.urlId;

  db.Url.findOne({
      where: {
        id: urlId
      }
    })
  .then(url => {
    let upvotes = url.upvoteCount;
    let downvotes = url.downvoteCount;
    let rating = Math.round((upvotes / (upvotes + downvotes)) * 100);
    res.json(rating);
  })
  .catch((err) => {
    console.error(err);
  });
};

handler.postUrlComment = (req, res) => {
  let url = req.body.url;
  let username = req.body.username;
  let comment = req.body.comment;

  if (typeof url === 'number') {
    db.User.findCreateFind({where: {username: username}})
    .spread((user) => {
      db.Comment.create({text: comment, commentId: null, urlId: url, userId: user.id})
    })
    .catch(err => {
      res.sendStatus(400);
    });
  } else {
    db.Url.findCreateFind({where: {'url': url}})
    .then(url => {
      db.User.findCreateFind({where: {username: username}})
      .spread((user) => {
        db.Comment.create({text: comment, commentId: null, urlId: url.id, userId: user.id});
      }).catch(err => {
        res.sendStatus(500);
      });
    }).catch(err => {
      res.sendStatus(500);
    });
  }
};

handler.postUrlVotes = (req, res) => {
  console.log(req.body);
  let url = req.body.url;
  let type = req.body.type;
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';

  if (typeof url === 'number') {
    db.Url.findOne({where: {id: url}})
    .then(url => {
      db.User.findCreateFind({where: {username: username}})
      .spread((user) => {
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
  } else {
    db.Url.create({'url': url})
    .then(url => {
      return db.Url.increment(typeCount, {where: {id: url.id}})
      .then(() => {
        db.User.findCreateFind({where: {username: username}})
        .spread((user) => {
          db.UrlVote.create({type: type, userId: user.id, urlId: url.id})
          .then(() => {
            db.User.increment(typeCount, {where: {id: user.id}});
            res.status(201).json(url.id);
          });
        }).catch(err => {
          res.sendStatus(400);
        });
      }).catch(err => {
        res.sendStatus(400);
      });
    })
    .catch(err => {
      res.sendStatus(400);
    });
  }
};

// the following function will generate a new stat page url or retrieve one if it exists in the DB

handler.generateRetrieveStatsPageUrl = (req, res) => {
  console.log('stat page url request received');
  let currentUrl = req.query.currentUrl;
  db.Url.findCreateFind({
      where: {
        url: currentUrl
      }
    })
    .spread(url => {
      console.log('inside else');
      let stpUrl = 'http://localhost:8080' + '/stats/redirect/' + url.id.toString();
      db.Url.update({
          statsPageUrl: stpUrl
        }, {
          where: {
            id: url.id
          }
        })
        .then(() => {
          console.log('new stat page URL created, transmitting: ', stpUrl);
          res.status(200).json(stpUrl);
        })
        .catch(function(err) {
          console.error(err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
};

module.exports = handler;