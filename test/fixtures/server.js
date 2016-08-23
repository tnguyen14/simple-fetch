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

server.get('/4xx', function (req, res, next) {
	res.send(400, {
		status: 'OK'
	});
	return next();
});

server.get('/inspect', function (req, res, next) {
	res.send({
		method: req.method,
		url: req.url,
		headers: req.headers
	});
	return next();
});

server.post('/inspect', function (req, res, next) {
	res.send({
		method: req.method,
		url: req.url,
		headers: req.headers
	});
	return next();
});

module.exports = server;
