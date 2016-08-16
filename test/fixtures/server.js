var restify = require('restify');

var server = restify.createServer({
	name: 'simple-fetch-test-server'
});

server.use(restify.bodyParser());

server.get('/posts', function (req, res, next) {
	res.send([{
		id: '1',
		content: 'Hello World'
	}]);
	return next();
});

server.post('/posts', function (req, res, next) {
	res.send(req.params);
	return next();
});

server.put('/posts/:id', function (req, res, next) {
	res.send(req.params);
	return next();
});

server.patch('/posts/:id', function (req, res, next) {
	res.send(req.params);
	return next();
});

server.del('/posts/:id', function (req, res, next) {
	res.send(req.params);
	return next();
});

module.exports = server;
