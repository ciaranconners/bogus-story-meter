const expect = require('chai').expect;
const db = require('../server/db/index.js');


describe('User tests', () => {
  it('should retrieve a user', (done) => {
    console.log('User: ', db.User);
    db.User.upsert({username: 'joe'})
    .then((data) => {
      console.log('hello', data);
      return db.User.findOne({ where: {username: 'joe'} });
    })
    .then((user) => {
      expect(user.username).to.equal('joe');
      // db.close();
      console.log('finishing user test');
      done();
    })
    .catch((err) => {
      console.log('finishing user test');
      console.error('ERROR: ', err);
      // db.close();
      // done();
    });
  });
  it('should insert a UrlVote', (done) => {
    db.User.findOne({where: {username: 'joe'}})
    .then((user) => {
      console.log('userID: ', user.id);
      return db.UrlVote.create({type: 'upvote', UserId: user.id});
    })
    .then((data) => {
      console.log('newly created UrlVote: ', data, null, 2);
      return db.UrlVote.findOne({ where: {type: 'upvote'} });
    })
    .then((vote) => {
      console.log('VOTE: ', vote);
      expect(vote.type).to.equal('upvote');
      // db.close();
      done();
    })
    .catch((err) => {
      console.error('ERROR: ', err);
      // db.close();
      // done();
    });
  });
});
