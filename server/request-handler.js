var handler = {};

handler.serveIndexGetRequest = function(req, res) {
  res.status(200).send('hello world');
};

handler.test = function(req, res) {
  console.log('Hitting test endpoint')
  res.status(200).send('hey world')
};

module.exports = handler;