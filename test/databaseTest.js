const expect = require('chai').expect;
const db = require('../server/db/index.js');


describe('first db test', () => {
  it('should retrieve a user', (done) => {
    db.models.User.create({username: 'Scott'})
    .then(() => {
      return db.models.User.findOne({ where: {username: 'Scott'} });
    })
    .then((user) => {
      expect(user.username).to.equal('Scott');
      db.close();
      done();
    })
    .catch((err) => {
      console.error(err);
      db.close();
      done();
    });
  });
});
