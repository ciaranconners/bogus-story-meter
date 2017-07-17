var db = require('../server/db/index.js');
const expect = require('chai').expect;

function makeUser(callback) {

return db.User.create({
    username: 'Scott'
  })
  .then(function() {
    callback();
  })
  .catch(function(err) {
    console.error(err);
  });
}

function getUser() {
  return db.User.findOne({where:{username: 'Scott'}})
  .then(function(user) {
    console.log(user);
  })
  .catch(function(err) {
    console.error(err);
  });
}

describe('first db test', () => {
  it('should retrieve a user', (done) => {
    makeUser(function() {
      getUser.then(function() {
        expect(user.username).to.equal('Scott');
        done();
      });
    });
  });
});

