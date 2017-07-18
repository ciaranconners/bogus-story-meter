var Sequelize = require('sequelize');
var connectionURL = require('./db-config.js').RDS_CONNECTION_URL;

var db = new Sequelize('bsm', 'root', '', {
  dialect: 'mysql'
});

var User = db.define('User', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  upvote_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  downvote_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  neutral_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  classMethods: {
    associate: (models) => {
      User.hasMany(models.UrlVote);
      User.hasMany(models.Comment);
      User.hasMany(models.CommentVote);
    }
  }
});

var Category = db.define('Category', {
  name: Sequelize.STRING,
  IdParent: Sequelize.INTEGER
}, {
  classMethods: {
    associate: (models) => {
      Category.hasMany(models.Category);
      Category.belongsTo(models.Category);
      Category.hasMany(models.Url);
    }
  }
});

var Url = db.define('Url', {
  url: {
    type: Sequelize.STRING,
    unique: true
  },
  IdCategory: Sequelize.INTEGER,
  upvote_count: Sequelize.INTEGER,
  downvote_count: Sequelize.INTEGER,
  neutral_count: Sequelize.INTEGER
}, {
  classMethods: {
    associate: (model) => {
      Url.belongsTo(models.Category);
      Url.hasMany(models.Comment);
    }
  }
});

var Comment = db.define('Comment', {
  text: Sequelize.TEXT,
  IdParent: Sequelize.INTEGER,
  IdUrl: Sequelize.INTEGER,
  IdUser: Sequelize.INTEGER
}, {
  classMethods: {
    associate: (models) => {
      Comment.belongsTo(models.Url);
      Comment.belongsTo(models.User);
      Comment.hasMany(models.Comment);
      Comment.belongsTo(models.Comment);
      Comment.hasMany(models.CommentVote);
    }
  }
});

var CommentVote = db.define('CommentVote', {
  type: Sequelize.STRING,
  IdComment: Sequelize.INTEGER,
  IdUser: Sequelize.INTEGER
}, {
  classMethods: {
    associate: (models) => {
      CommentVote.belongsTo(models.User);
      CommentVote.belongsTo(models.Comment);
    }
  }
});

var UrlVote = db.define('UrlVote', {
  type: Sequelize.STRING,
  UserId: Sequelize.INTEGER
}, {
  classMethods: {
    associate: (models) => {
      UrlVote.belongsTo(models.User);
    }
  }
});

User.sync()
  .then(() => {
    return UrlVote.sync();
  })
  .then(() => {
    return Category.sync();
  })
  .then(() => {
    return Url.sync();
  })
  .then(() => {
    return Comment.sync();
  })
  .then(() => {
    return CommentVote.sync();
  });

module.exports = {
  User: User,
  UrlVote: UrlVote
};