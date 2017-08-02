const app = require('./routes.js');

const port = process.env.port || 8080;

module.exports = app.listen(port, function() {
  console.log('listening on port ' + port);
});
