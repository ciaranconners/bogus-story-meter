var Sequelize = require('sequelize');
var config = require('./db-config.js');

var db = new Sequelize(config.RDS_CONNECTION_URL, {dialect: 'mysql'});

var User = db.define('User', {
  username: Sequelize.STRING,
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  upvote_count: {type: Sequelize.INTEGER, defaultValue: 0},
  downvote_count: {type: Sequelize.INTEGER, defaultValue: 0},
  neutral_count: {type: Sequelize.INTEGER, defaultValue: 0}
}).sync();

var Url = db.define('Url', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  id_category: {
    type: Sequelize.INTEGER,
    references: {
      model: Category,
      key: 'id'
    }
  },
  id_parent: Sequelize.STRING,
  upvote_count: Sequelize.INTEGER,
  downvote_count: Sequelize.INTEGER,
  neutral_count: Sequelize.INTEGER
});

var Category = db.define('Category', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: Sequelize.STRING,
  id_parent: {
    type: Sequelize.INTEGER,
    references: {
      model: Category,
      key: 'id'
    }
  }
});

var Url_vote = db.define('Url_vote', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  id_user: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  id_url: {
    type: Sequelize.INTEGER,
    references: {
      model: Url,
      key: 'id'
    }
  },
  type: Sequelize.STRING
});

var Comment = db.define('Comment', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  id_url: {
    type: Sequelize.INTEGER,
    references: {
      model: Url,
      key: 'id'
    }
  },
  id_user: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  id_parent: {
    type: Sequelize.INTEGER,
    references: {
      model: Comment,
      key: 'id'
    }
  },
  text: Sequelize.STRING
});

var Comment_vote = db.define('Comment_vote', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  id_comment: {
    type: Sequelize.INTEGER,
    references: {
      model: Comment,
      key: 'id'
    }
  },
  id_user: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  }
});

module.exports = db;
