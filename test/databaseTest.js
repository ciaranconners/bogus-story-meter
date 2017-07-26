const expect = require('chai').expect;
const db = require('../server/db/index.js');

/*eslint-disable indent*/

describe('Database tests', () => {

  it('should retrieve a user', (done) => {
    db.User.upsert({username: 'joe', password: 'ciaran'})
    .then((data) => {
      return db.User.findOne({ where: {username: 'joe'} });
    })
    .then((user) => {
      expect(user.username).to.equal('joe');
      done();
    })
    .catch((err) => {
      console.error('ERROR: ', err);
      done(err);
    });
  });

  it('should insert a UrlVote', (done) => {
    db.User.findOne({where: {username: 'joe'}})
    .then((user) => {
      return db.UrlVote.create({type: 'upvote', userId: user.id});
    })
    .then((data) => {
      return db.UrlVote.findOne({ where: {type: 'upvote'} });
    })
    .then((vote) => {
      expect(vote.type).to.equal('upvote');
      done();
    })
    .catch((err) => {
      console.error('ERROR: ', err);
      done(err);
    });
  });

  it('should insert a Category', (done) => {
    db.Category.create({name: 'Science'})
    .then(() => {
      return db.Category.findOne({where: {name: 'Science'}});
    })
    .then((category) => {
      expect(category.name).to.equal('Science');
      done();
    })
    .catch((err) => {
      console.error('error inserting/finding category', err);
      done(err);
    });
  });

  it('should insert a reference to parent Category', (done) => {
    db.Category.findOne({where: {name: 'Science'}})
    .then((category) => {
      return db.Category.create({name: 'Physics', categoryId: category.id});
    })
    .then(() => {
      return db.Category.findOne({where: {name: 'Physics'}});
    })
    .then((category) => {
      expect(category.categoryId).to.equal(1);
      done();
    })
    .catch((err) => {
      console.error('error inserting/finding category: ', err);
      done(err);
    });
  });

  it('should insert a Url', (done) => {
    const testUrl = 'https://www.theguardian.com/science/life-and-physics/2017/jul/17/getting-to-the-bottom-of-the-higgs-boson';

    db.Category.findOne({where: {name: 'Physics'}})
    .then((category) => {
      return db.Url.create({url: testUrl, categoryId: category.id});
    })
    .then(() => {
      return db.Url.findOne({where: {url: testUrl}});
    })
    .then((url) => {
      expect(url.url).to.equal(testUrl);
      expect(url.categoryId).to.equal(2);
      done();
    })
    .catch((err) => {
      console.error('error inserting url: ', err);
      done(err);
    });
  });

  it('should insert a Comment', (done) => {
    const testText = 'Sheldon: Do you know about the Higgs boson?';

    db.Comment.create({text: testText, urlId: 1, userId: 1})
    .then(() => {
      return db.Comment.findOne({where: {text: testText}});
    })
    .then((comment) => {
      expect(comment.text).to.equal(testText);
      expect(comment.urlId).to.equal(1);
      expect(comment.userId).to.equal(1);
      expect(comment.commentId).to.be.null;
      done();
    })
    .catch((err) => {
      console.error('error inserting comment: ', err);
      done(err);
    });
  });

  it('should insert a reply Comment', (done) => {
    const testText = 'Penny: Of course. It\'s been in the news, and it\'s a very famous boson.';

    db.Comment.create({text: testText, urlId: 1, userId: 1, commentId: 1})
    .then(() => {
      return db.Comment.findOne({where: {text: testText}});
    })
    .then((comment) => {
      expect(comment.commentId).to.equal(1);
      done();
    })
    .catch((err) => {
      console.error('error replying to Comment: ', err);
      done(err);
    });
  });

  it('should insert a CommentVote', (done) => {

    db.CommentVote.create({commentId: 1, userId: 1, type: 'upvote'})
    .then(() => {
      return db.CommentVote.findOne({where: {commentId: 1, userId: 1}});
    })
    .then(commentVote => {
      expect(commentVote.type).to.equal('upvote');
      done();
    })
    .catch((err) => {
      console.error('error inserting CommentVote: ', err);
      done(err);
    });
  });

  //create test
  it('should not insert another CommentVote if the user already voted on a comment', (done) => {
    expect(() => {
      return db.CommentVote.create({commentId: 1, userId: 1, type: 'upvote'});
    }).to.throw();
    done();
  });

  it('should not insert another UrlVote if the user already voted on a Url', (done) => {

  });

  it('should insert a CommentVote if previous vote by the same user is deleted', (done) => {

  });

  it('should insert a UrlVote if previous vote by the same user is deleted', (done) => {

  });

  it('should insert a User into AuthUser', (done) => {
      db.AuthUser.create({username: 'ciaranconners@gmail.com', image: 'somepic', firstLast: 'yo'})
      .then(() => {
        return db.AuthUser.findOne({where:{username: 'ciaranconners@gmail.com'}});
    }).then((user) => {
      expect(user.username).to.equal('ciaranconners@gmail.com');
    })
    .catch((err) => {
      done(err);
    });
  });
});


