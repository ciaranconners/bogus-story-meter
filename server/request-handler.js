const db = require('./db/index.js');
const utils = require('./utils.js');

const handler = {};

/*eslint-disable indent*/
handler.getUrlData = (req, res) => {
  let url = req.query.currentUrl;
  let username = req.query.currentUser;
  let profilepicture = req.query.currentProfilePicture;
  let fullname = req.query.currentName;
  db.User.findCreateFind( {where: {'username': username, 'profilepicture': profilepicture, 'fullname': fullname}} )
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
          rating = utils.calculateRating(urlEntry.upvoteCount, urlEntry.downvoteCount);
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

// the following function will generate a new stat page url or retrieve one if it exists in the DB
handler.generateRetrieveStatsPageUrl = (req, res) => {
  let currentUrl = req.query.currentUrl;
  db.Url.findCreateFind({
      where: {
        url: currentUrl
      }
    })
    .spread(url => {
      let stpUrl = 'http://localhost:8080' + '/stats/redirect/' + url.id.toString();
      console.log('new stat page URL created, transmitting: ', stpUrl);
      res.status(200).json(stpUrl);

    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// this function should check if there's a session first, otherwise you get type errors when the user is set to null
handler.getUrlStats = (req, res) => {
  let urlId = req.query.urlId;
  let urlData = {username: req.session.username};
  db.Url.findOne({where: {id: urlId}})
  .then(urlEntry => {
    urlData.url = urlEntry.url;
    urlData.rating = utils.calculateRating(urlEntry.upvoteCount, urlEntry.downvoteCount);
  })
  .then(() => {
    return db.User.findOne({where: {username: urlData.username}});
  })
  .then(user => {
    return db.UrlVote.findOne({where: {userId: user.id, urlId: urlId}});
  })
  .then(vote => {
    vote ? urlData.vote = vote.type : urlData.vote = null;
    res.send(urlData);
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
};

handler.getAllActivity = (req, res) => {
  db.Url.findAll({'limit': 15})
  .then(activity => {
    res.status(200).json(activity);
  });
};

handler.getUserActivity = (req, res) => {
  let username = req.query.username;
  db.User.findOne( {'where': {'username': username}} )
  .then((userEntry) => {
    return db.UrlVote.findAll( {'where': {'userId': userEntry.id}} )
    .then((userVotes) => {
      return db.Comment.findAll( {'where': {'userId': userEntry.id}} )
      .then((userComments) => {

        var userVotesPromises = userVotes.map((row) => {
          return db.Url.findOne( {'where': {'id': row.urlId}} )
          .then((urlEntry) => {
            row.dataValues.url = urlEntry.url;
            return row;
          });
        });

        var userCommentsPromises = userComments.map((row) => {
          return db.Url.findOne( {'where': {'id': row.urlId}} )
          .then((urlEntry) => {
            row.dataValues.url = urlEntry.url;
            return row;
          });
        });
        Promise.all(userVotesPromises).then((userVotesNew) => {
          Promise.all(userCommentsPromises).then((userCommentsNew) => {
            res.json({'userComments': userCommentsNew, 'userVotes': userVotesNew});
          });
        });
      });
    });
  });
};

module.exports = handler;
