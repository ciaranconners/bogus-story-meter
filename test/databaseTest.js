const expect = require('chai').expect;
const db = require('../server/db/index.js');


describe('User tests', () => {
  it('should retrieve a user', (done) => {
    db.models.User.create({username: 'Sam'})
    .then(() => {
      return db.models.User.findOne({ where: {username: 'Sam'} });
    })
    .then((user) => {
      expect(user.username).to.equal('Sam');
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
