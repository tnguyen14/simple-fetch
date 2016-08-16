var simpleFetch = require('../');
var tap = require('tap');
var server = require('./fixtures/server');

var SERVER_PORT = 4003;

tap.test('simple-fetch', function (t) {
	t.beforeEach(function (done) {
		server.listen(SERVER_PORT, done);
	});
	t.afterEach(function (done) {
		server.close(done);
	});
	t.test('getJson', function (t) {
		simpleFetch.getJson(server.url + '/posts')
			.then(function (posts) {
				t.same(posts, [{
					id: '1',
					content: 'Hello World'
				}]);
				t.end();
			}, function (err) {
				t.notOk(err);
				t.end();
			});
	});
	t.test('postJson', function (t) {
		simpleFetch.postJson(server.url + '/posts', {
			id: '1',
			content: 'Test'
		})
			.then(function (resp) {
				t.same(resp, {
					id: '1',
					content: 'Test'
				});
				t.end();
			}, function (err) {
				t.notOk(err);
				t.end();
			});
	});
	t.test('putJson', function (t) {
		simpleFetch.putJson(server.url + '/posts/1', {
			content: 'Foo'
		})
			.then(function (resp) {
				t.same(resp, {
					id: '1',
					content: 'Foo'
				});
				t.end();
			}, function (err) {
				t.notOk(err);
				t.end();
			});
	});
	t.test('patchJson', function (t) {
		simpleFetch.patchJson(server.url + '/posts/1', {
			content: 'Bar'
		})
			.then(function (resp) {
				t.same(resp, {
					id: '1',
					content: 'Bar'
				});
				t.end();
			}, function (err) {
				t.notOk(err);
				t.end();
			});
	});
	t.test('deleteJson', function (t) {
		simpleFetch.deleteJson(server.url + '/posts/1')
			.then(function (resp) {
				t.same(resp, {
					id: '1'
				});
				t.end();
			}, function (err) {
				t.notOk(err);
				t.end();
			});
	});
	t.test('4xx', function (t) {
		simpleFetch.getJson(server.url + '/4xx')
			.then(function (resp) {
				t.end();
			}, function (err) {
				t.ok(err, 'should throw an error');
				t.end();
			});
	});
	t.test('4xx not simple', function (t) {
		simpleFetch.getJson(server.url + '/4xx', {
			only2xx: false
		})
			.then(function (resp) {
				t.same(resp, {
					status: 'OK'
				});
				t.end();
			}, function (err) {
				console.log(err);
				t.notOk(err);
				t.end();
			});
	});
	t.test('skip parsing', function (t) {
		simpleFetch.postJson(server.url + '/posts', {
			id: '1',
			content: 'Baz'
		}, {
			skipParsing: true
		})
			.then(function (resp) {
				/* global Response */
				t.ok(resp instanceof Response, 'Response object is returned');
				t.end();
			});
	});
	t.end();
});
