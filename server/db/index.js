var Sequelize = require('sequelize');
// var db = new Sequelize(process.env.RDS_CONNECTION_URL, {dialect: 'mysql'});
var db = new Sequelize('mysql://TeamSSP:TeamSSP123@bogus-story-meter-dev2.c6w6pvtpmovr.us-east-2.rds.amazonaws.com:3306', {dialect: 'mysql'});

module.exports = {};

module.exports.User = db.define('User', {
  username: Sequelize.STRING,
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  upvote_count: {type: Sequelize.INTEGER, defaultValue: 0},
  downvote_count: {type: Sequelize.INTEGER, defaultValue: 0},
  neutral_count: {type: Sequelize.INTEGER, defaultValue: 0}
});

module.exports.Url = db.define('Url', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  id_category: {
    type: Sequelize.INTEGER,
    references: {
      model: module.exports.Category,
      key: 'id'
    }
  },
  id_parent: Sequelize.STRING,
  upvote_count: Sequelize.INTEGER,
  downvote_count: Sequelize.INTEGER,
  neutral_count: Sequelize.INTEGER
});

module.exports.Category = db.define('Category', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: Sequelize.STRING,
  id_parent: {
    type: Sequelize.INTEGER,
    references: {
      model: module.exports.Category,
      key: 'id'
    }
  }
});

module.exports.Url_vote = db.define('Url_vote', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  id_user: {
    type: Sequelize.INTEGER,
    references: {
      model: module.exports.User,
      key: 'id'
    }
  },
  id_url: {
    type: Sequelize.INTEGER,
    references: {
      model: module.exports.Url,
      key: 'id'
    }
  },
  type: Sequelize.STRING
});

module.exports.Comment = db.define('Comment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  id_url: {
    type: Sequelize.INTEGER,
    references: {
      model: module.exports.Url,
      key: 'id'
    }
  },
  id_user: {
    type: Sequelize.INTEGER,
    references: {
      model: module.exports.User,
      key: 'id'
    }
  },
  id_parent: {
    type: Sequelize.INTEGER,
    references: {
      model: module.exports.Comment,
      key: 'id'
    }
  },
  text: Sequelize.STRING
});

module.exports.Comment_vote = db.define('Comment_vote', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  id_comment: {
    type: Sequelize.INTEGER,
    references: {
      model: module.exports.Comment,
      key: 'id'
    }
  },
  id_user: {
    type: Sequelize.INTEGER,
    references: {
      model: module.exports.User,
      key: 'id'
    }
  }
});

