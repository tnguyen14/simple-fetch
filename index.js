'use strict';

require('es6-promise').polyfill();
require('isomorphic-fetch');

function parseJSON (response) {
	return response.json();
}

function getJson (url) {
	return fetch(url).then(parseJSON);
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
		}).then(parseJSON);
	};
}

module.exports = {
	getJson: getJson,
	postJson: createJsonMethod('POST'),
	putJson: createJsonMethod('PUT'),
	patchJson: createJsonMethod('PATCH')
};
