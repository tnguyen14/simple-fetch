'use strict';

const fetch = require('cross-fetch');
const merge = require('lodash.merge');

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

function createJsonMethod (method, defaultOpts) {
	var headers = {
		'Accept': 'application/json'
	};
	var sendData = false;
	if (['post', 'patch', 'put'].indexOf(method.toLowerCase()) !== -1) {
		sendData = true;
	}
	if (sendData) {
		headers['Content-Type'] = 'application/json';
	}
	var options = merge({
		method: method,
		headers: headers
	}, defaultOpts);
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
			// for get and delete, enable opts to be set if data is skipped
			if (data && !opts) {
				opts = data;
			}
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

function createFetch(defaultOpts) {
	const fetchInstance = function simpleFetch(method, url, data, opts) {
		return createJsonMethod(method, defaultOpts)(url, data, opts);
	}
	fetchInstance.getJson = createJsonMethod('GET', defaultOpts);
	fetchInstance.postJson = createJsonMethod('POST', defaultOpts);
	fetchInstance.putJson = createJsonMethod('PUT', defaultOpts);
	fetchInstance.patchJson = createJsonMethod('PATCH', defaultOpts);
	fetchInstance.deleteJson = createJsonMethod('DELETE', defaultOpts);

	return fetchInstance;
}

module.exports = createFetch();
module.exports.createFetch = createFetch;
