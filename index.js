'use strict';

/* global fetch */

require('es6-promise').polyfill();
require('isomorphic-fetch');

var headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
};

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

function getJson (url, opts) {
	return fetch(url, Object.assign({
		headers: {
			'Accept': 'application/json'
		}
	}, opts))
		.then(checkStatus)
		.then(parseJSON);
}

function deleteJson (url, opts) {
	return fetch(url, Object.assign({
		method: 'DELETE',
		headers: headers
	}, opts))
		.then(checkStatus)
		.then(parseJSON);
}

function createJsonMethod (method) {
	return function (url, data, opts) {
		var json = data;
		if (typeof data === 'object') {
			json = JSON.stringify(data);
		} else if (typeof data !== 'string') {
			throw new Error('Data must be an object or a JSON string.');
		}

		return fetch(url, Object.assign({
			method: method,
			headers: headers,
			body: json
		}, opts))
			.then(checkStatus)
			.then(parseJSON);
	};
}

module.exports = {
	getJson: getJson,
	postJson: createJsonMethod('POST'),
	putJson: createJsonMethod('PUT'),
	patchJson: createJsonMethod('PATCH'),
	deleteJson: deleteJson
};
