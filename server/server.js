var app = require('./routes.js');

var port = process.env.port || 80;

module.exports = app.listen(port, function() {
	console.log('listening on port ' + port);
});
