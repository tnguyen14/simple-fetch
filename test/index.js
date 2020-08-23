const simpleFetch = require('../');
const tap = require('tap');
const server = require('./fixtures/server');
const Response = require('cross-fetch').Response;

const SERVER_PORT = 4033;

tap.test('simple-fetch', function (t) {
	t.beforeEach(function (done) {
		server.listen(SERVER_PORT, done);
	});
	t.afterEach(function (done) {
		server.close(done);
	});
	t.test('getJson', function (t) {
		simpleFetch('get', `${server.url}/posts`)
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
	t.test('getJson - with headers', function (t) {
		simpleFetch('get', `${server.url}/inspect`, {
			headers: {
				Authorization: 'Bearer asdfghjkl'
			}
		}).then(function (req) {
			t.equal(req.headers.authorization, 'Bearer asdfghjkl');
			t.end();
		}, function (err) {
			t.notOk(err);
			t.end();
		});
	});
	t.test('getJson - with opts and null data', function (t) {
		simpleFetch('get', `${server.url}/inspect`, null, {
			headers: {
				Authorization: 'Bearer asdfghjkl'
			}
		}).then(function (req) {
			t.equal(req.headers.authorization, 'Bearer asdfghjkl');
			t.end();
		}, function (err) {
			t.notOk(err);
			t.end();
		});
	});
	t.test('getJson - convenient method', function (t) {
		simpleFetch.getJson(`${server.url}/posts`)
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
		simpleFetch('post', `${server.url}/posts`, {
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
	t.test('postJson - with headers', function (t) {
		simpleFetch('post', `${server.url}/inspect`, {}, {
			headers: {
				Authorization: 'Bearer asdfghjkl'
			}
		}).then(function (req) {
			t.equal(req.headers.authorization, 'Bearer asdfghjkl');
			t.end();
		}, function (err) {
			t.notOk(err);
			t.end();
		});
	});
	t.test('postJson - convenient method', function (t) {
		simpleFetch.postJson(`${server.url}/posts`, {
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
		simpleFetch('put', `${server.url}/posts/1`, {
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
	t.test('putJson - convenient method', function (t) {
		simpleFetch.putJson(`${server.url}/posts/1`, {
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
		simpleFetch('patch', `${server.url}/posts/1`, {
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
	t.test('patchJson - convenient method', function (t) {
		simpleFetch.patchJson(`${server.url}/posts/1`, {
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
		simpleFetch('delete', `${server.url}/posts/1`)
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
	t.test('deleteJson - convenient method', function (t) {
		simpleFetch.deleteJson(`${server.url}/posts/1`)
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
		simpleFetch('get', `${server.url}/4xx`)
			.then(function (resp) {
				t.end();
			}, function (err) {
				t.ok(err, 'should throw an error');
				t.end();
			});
	});
	t.test('4xx not simple', function (t) {
		simpleFetch('get', `${server.url}/4xx`, {
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
		simpleFetch('post', `${server.url}/posts`, {
			id: '1',
			content: 'Baz'
		}, {
			skipParsing: true
		})
			.then(function (resp) {
				t.ok(resp instanceof Response, 'Response object is returned');
				t.end();
			});
	});
	t.test('additional headers', function (t) {
		simpleFetch('get', `${server.url}/inspect`, {
			headers: {
				'x-custom-header': 'asdfgc'
			}
		})
			.then(function (res) {
				t.equal(res.headers['x-custom-header'], 'asdfgc');
				t.end();
			}, function (err) {
				t.notOk(err);
				console.log(err);
				t.end();
			});
	});
	t.end();
});
