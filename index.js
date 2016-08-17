'use strict';

/* global fetch */

require('es6-promise').polyfill();
require('isomorphic-fetch');
var merge = require('lodash.merge');

function checkStatus (response) {
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
	return function (url, data, opts) {
		var only2xx = true;
		var skipParsing = false;
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
		if (opts && opts.skipParsing === true) {
			skipParsing = true;
		}

		return fetch(url, merge({}, options, opts))
			.then(function (response) {
				if (!only2xx) {
					return response;
				}
				return checkStatus(response);
			})
			.then(function (response) {
				if (skipParsing) {
					return response;
				}
				return parseJSON(response);
			});
	};
}

module.exports = {
	getJson: createJsonMethod('GET'),
	postJson: createJsonMethod('POST', true),
	putJson: createJsonMethod('PUT', true),
	patchJson: createJsonMethod('PATCH', true),
	deleteJson: createJsonMethod('DELETE')
};
