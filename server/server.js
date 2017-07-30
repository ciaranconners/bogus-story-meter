let app = require('./routes.js');

let port = process.env.port || 8080;

module.exports = app.listen(port, function() {
  console.log('listening on port ' + port);
});
