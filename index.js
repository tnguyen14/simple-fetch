'use strict';

/* global fetch */

require('es6-promise').polyfill();
require('isomorphic-fetch');

function checkStatus (only2xx, response) {
	if (!only2xx) {
		return response;
	}
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		var error = new Error(response.statusText);
		error.response = response;
		throw error;
	}
}

function parseJSON (response) {
	return response.json();
}

function createJsonMethod (method, sendData) {
	var headers = {
		'Accept': 'application/json'
	};
	if (sendData) {
		headers['Content-Type'] = 'application/json';
	}
	var options = {
		method: method,
		headers: headers
	};
	var only2xx = true;
	return function (url, data, opts) {
		if (sendData) {
			var json = data;
			if (typeof data === 'object') {
				json = JSON.stringify(data);
			} else if (typeof data !== 'string') {
				throw new Error('Data must be an object or a JSON string.');
			}
			options.body = json;
		} else {
			opts = data;
		}
		if (opts && opts.only2xx === false) {
			only2xx = false;
		}

		return fetch(url, Object.assign(options, opts))
			.then(checkStatus.bind(global, only2xx))
			.then(parseJSON);
	};
}

module.exports = {
	getJson: createJsonMethod('GET'),
	postJson: createJsonMethod('POST', true),
	putJson: createJsonMethod('PUT', true),
	patchJson: createJsonMethod('PATCH', true),
	deleteJson: createJsonMethod('DELETE')
};
