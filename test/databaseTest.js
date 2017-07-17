const expect = require('chai').expect;
const db = require('../server/db/index.js');


describe('first db test', () => {
  it('should retrieve a user', (done) => {
    db.models.User.create({username: 'John'})
    .then(() => {
      return db.models.User.findOne({ where: {username: 'John'} });
    })
    .then((user) => {
      expect(user.username).to.equal('John');
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
