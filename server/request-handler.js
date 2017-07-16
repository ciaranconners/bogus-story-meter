var handler = {};

handler.serveIndexGetRequest = function(req, res) {
  res.status(200).send('hello world');
};

module.exports = handler;