'use strict';

/* global fetch */

require('es6-promise').polyfill();
require('isomorphic-fetch');

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

function getJson (url) {
	return fetch(url)
		.then(checkStatus)
		.then(parseJSON);
}

function deleteJson (url) {
	return fetch(url, {
		method: 'DELETE'
	})
		.then(checkStatus)
		.then(parseJSON);
}

function createJsonMethod (method) {
	return function (url, data) {
		var json = data;
		if (typeof data === 'object') {
			json = JSON.stringify(data);
		} else if (typeof data !== 'string') {
			throw new Error('Data must be an object or a JSON string.');
		}

		return fetch(url, {
			method: method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: json
		})
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
