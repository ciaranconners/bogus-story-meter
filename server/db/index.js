const Sequelize = require('sequelize');
const connectionUrl = require('./db-config.js').RDS_CONNECTION_URL;

const db = new Sequelize('bsm', 'root', '', {
  dialect: 'mysql',
  logging: false
});

// let db = new Sequelize(connectionUrl, {
//   dialect: 'mysql',
//   logging: false
// });

const User = db.define('User', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  fullname: {
    type: Sequelize.STRING
  },
  profilepicture: {
    type: Sequelize.STRING
  },
  upvoteCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  downvoteCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  neutralCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  token: {
    type: Sequelize.STRING
  },
  verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
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

const Category = db.define('Category', {
  name: {
    type: Sequelize.STRING,
    unique: true
  }
}, {
  classMethods: {
    associate: (models) => {
      Category.hasMany(models.Category);
      Category.belongsTo(models.Category);
      Category.hasMany(models.Url);
    }
  }
});

const Url = db.define('Url', {
  url: {
    type: Sequelize.STRING,
    unique: true
  },
  categoryId: Sequelize.INTEGER,
  upvoteCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  title: Sequelize.STRING,
  downvoteCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  neutralCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  classMethods: {
    associate: (models) => { //john: used to say model
      Url.belongsTo(models.Category);
      Url.hasMany(models.Comment);
    }
  }
});

const Comment = db.define('Comment', {
  text: Sequelize.TEXT('medium'),
  commentId: Sequelize.INTEGER,
  urlId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER,
  upvoteCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  downvoteCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
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

const CommentVote = db.define('CommentVote', {
  type: Sequelize.STRING,
  commentId: {type: Sequelize.INTEGER, unique: 'userCommentId'},
  userId: {type: Sequelize.INTEGER, unique: 'userCommentId'}
}, {
  classMethods: {
    associate: (models) => {
      CommentVote.belongsTo(models.User);
      CommentVote.belongsTo(models.Comment);
    }
  }
});

//todo: make sure unique composite works
const UrlVote = db.define('UrlVote', {
  type: Sequelize.STRING,
  userId: {type: Sequelize.INTEGER, unique: 'userUrlId'},
  urlId: {type: Sequelize.INTEGER, unique: 'userUrlId'}
}, {
  classMethods: {
    associate: (models) => {
      UrlVote.belongsTo(models.User);
      UrlVote.belongsTo(models.Url);
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
    CommentVote.sync();
  });

module.exports = db.models;
