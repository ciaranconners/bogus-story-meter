const db = require('./db/index.js');

const handler = {};

/*eslint-disable indent*/
handler.getUrlData = (req, res) => {
  let url = req.query.currentUrl;
  let username = req.query.currentUser;

  db.User.findCreateFind( {where: {'username': username}} )
  .spread((userEntry) => {
    return db.Url.findOne( {where: {url: url}} )
    .then((urlEntry) => {
      if (urlEntry === null) {
        res.json( {
          'rating': null,
          'urlId': null,
          'userId': userEntry.id,
          'userVote': null
        });
      } else {
        return db.UrlVote.findOne( {where: {'userId': userEntry.id, 'urlId': urlEntry.id}} )
        .then((voteEntry) => {
          let upvotes = urlEntry.upvoteCount;
          let downvotes = urlEntry.downvoteCount;
          rating = Math.round((upvotes / (upvotes + downvotes)) * 100);
          if (voteEntry) {
            res.json( {
              'rating': rating,
              'urlId': urlEntry.id,
              'userId': userEntry.id,
              'userVote': voteEntry.type
            });
          } else {
            res.json( {
              'rating': rating,
              'urlId': urlEntry.id,
              'userId': userEntry.id,
              'userVote': null
            });
          }
        });
      }
    });
  });
};

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
  let urlId = req.body.urlId;
  let username = req.body.username;
  let comment = req.body.comment;

  if (urlId !== null) {
    db.User.findCreateFind({where: {username: username}})
    .spread((user) => {
      db.Comment.create({text: comment, commentId: null, urlId: urlId, userId: user.id});
    })
    .catch(err => {
      res.sendStatus(400);
    });
  } else if (urlId === null) {
    db.Url.findCreateFind({where: {'url': url}})
    .spread(url => {
      db.User.findCreateFind({where: {username: username}})
      .spread((user) => {
        db.Comment.create({text: comment, commentId: null, urlId: url.id, userId: user.id});
        res.status(201).json(url.id);
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
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';

  if (urlId !== null) {
    db.Url.findOne({where: {id: urlId}})
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
  } else if (urlId === null) {
    db.Url.findCreateFind({where: {'url': url}})
    .spread(url => {
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

handler.putUrlVotes = (req, res) => {
  console.log(req.body);
  let url = req.body.url;
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';

  db.Url.findOne( {where: {id: urlId}} )
  .then((urlEntry) => {
    db.User.findOne( {where: {username: username}} )
    .then((userEntry) => {
      db.UrlVote.findOne( {where: {userId: userEntry.id, urlId: urlEntry.id}} )
      .then((voteEntry) => {
        let oldTypeCount = voteEntry.type+'Count';
        let oldType = voteEntry.type;
        userEntry.decrement(oldTypeCount);
        urlEntry.decrement(oldTypeCount);
        userEntry.increment(typeCount);
        urlEntry.increment(typeCount)
        .then(() => {
          db.UrlVote.update( {type: type}, {where: {userId: userEntry.id, urlId: urlEntry.id}} )
          res.status(201).json(urlEntry.id);
        });
      });
    });
  });
};

// the following function will generate a new stat page url or retrieve one if it exists in the DB

handler.generateRetrieveStatsPageUrl = (req, res) => {
  console.log('stat page url request received');
  let currentUrl = req.query.currentUrl;
  console.log('---------------currentUrl', currentUrl);
  if (typeof currentUrl === 'number') {
    db.Url.findCreateFind({
        where: {
          id: currentUrl
        }
      })
      .spread(url => {
        console.log('inside if');
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
          .catch((err) => {
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
  } else {
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
          .catch((err) => {
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
  }
};

handler.getUrlStats = (req, res) => {
  console.log('------------------req.body', req.body);
  console.log('-------------------req.query', req.query);
  let urlId = JSON.parse(req.query.urlId);

  console.log('-----------------------urlid: ', urlId);

  if (typeof urlId === 'number') {
    console.log('-----------------------------in if');
    db.Url.findOne({
      where: {
        id: urlId
      }
    })
    .then((data) => {
      console.log('------------------data.url', data.url);
      res.send(data.url);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  } else {
    console.log('-----------------------------in else');
    db.Url.findOne({
      where: {
        url: urlId
      }
    })
    .then((data) => {
      console.log('------------------data.url', data.url);
      res.send(data.url);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  }
}


handler.postAuth = function(req, res, next) {
  console.log(req.body);
  db.User.findCreateFind({
    where: {
      username: req.body.username,
      image: req.body.image,
      firstLast: req.body.name
    }
  })
  .spread(function(user) {
    console.log('all set, new', user);
    res.status(200);
  })
  .catch(function(err) {
    console.error(err);
    res.status(500);
  });
};

handler.getAuth = function(req, res, next) {
  console.log('USERNAME:', req.body.username);
  db.User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(function(user) {
    console.log('all set');
    res.status(200);
  })
  .catch(function(err) {
    console.error(err);
  });
};

// db.allDocs({include_docs: true}).then(function (result) {
//   return Promise.all(result.rows.map(function (row) {
//     return db.remove(row.doc);
//   }));
// }).then(function (arrayOfResults) {
//   // All docs have really been removed() now!
// });

handler.getUserActivityTEST = (req, res) => {
  let username = req.query.username;
  db.User.findOne( {'where': {'username': username}} )
  .then((userEntry) => {
    return db.UrlVote.findAll( {'where': {'userId': userEntry.id}} )
    .then((userVotes) => {
// console.log('========================user votes ', userVotes.length)
      var userPromises = userVotes.map((row) => {
// console.log('================ row.urlId ', row.urlId)
        return db.Url.findOne( {'where': {'id': row.urlId}} )
        .then((urlEntry) => {
console.log('================ urlEntry ', urlEntry)
          row.dataValues.url = urlEntry.url;
          return row;
        })
      })
      Promise.all(userPromises).then((userVotesNew) => {
        console.log('================================= uservotesnew ', userVotesNew)
        res.json({'userVotes': userVotesNew})
      })
    })
  })
}

handler.getUserActivity = (req, res) => {
  let username = req.query.username;
  db.User.findOne( {'where': {'username': username}} )
  .then((userEntry) => {
    return db.UrlVote.findAll( {'where': {'userId': userEntry.id}} )
    .then((userVotes) => {
      console.log('========================user votes ', userVotes)
      return db.Comment.findAll( {'where': {'userId': userEntry.id}} )
      .then((userComments) => {
        res.status(200).json({'userVotes': userVotes, 'userComments': userComments})
      })
      .catch(function(err) {
        console.error(err);
        res.sendStatus(404);
      });
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(404);
    });
  })
  .catch(function(err) {
    console.error(err);
    res.sendStatus(404);
  });
};

module.exports = handler;
