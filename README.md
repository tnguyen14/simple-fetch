# simple-fetch
> a simple wrapper around [isomorphic-fetch](matthew-andrews/isomorphic-fetch) to make it easier to work with common [fetch](github/fetch) tasks

This is only meant for more convenient basic JSON requests. Please use the fetch API for more complex use cases.

## Examples/ API

```js
var simpleFetch = require('simple-fetch');
var getJson = simpleFetch.getJson;
var postJson = simpleFetch.postJson;

getJson('http://myapi.com/events')
	.then(function (events) {
		console.log(events);
	});

postJson('http://myapi.com/events', {
	name: 'New Event',
	date: 'tomorrow'
})
	.then(function (response) {
		console.log(response);
	});
```
