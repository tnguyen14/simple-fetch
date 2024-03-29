# simple-fetch
> a simple wrapper around [cross-fetch](https://github.com/lquixada/cross-fetch) to make it easier to work with common [fetch](github/fetch) tasks

This is only meant for more convenient basic JSON requests. Please use the fetch API for more complex use cases.

By default, HTTP response codes other than 2xx will cause the fetch promise handler to throw. To change this behavior, set `opts.only2xx = false`.

## Examples

```js
const simpleFetch = require('simple-fetch');
const { getJson, postJson } = simpleFetch;

getJson('https://myapi.com/events')
  .then(function (events) {
    console.log(events);
  });

const response = await postJson('https://myapi.com/events', {
  name: 'New Event',
  date: 'tomorrow'
}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

simpleFetch('patch', 'https://myapi.com/events/1', {
  name: 'Other Event',
  date: 'next Sunday'
}).then(...)
```

If common options, such as headers, need to be passed to all methods, use `createFetch`:

```js
const { createFetch } = require('simple-fetch');
const { getJson, deleteJson } = createFetch({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

await getJson('https://myauthenticatedapi.com/events');
await deleteJson('https://myauthenticatedapi.com/events/2');

```

## API

- `simpleFetch(method, url[, data][, opts])`
- `.getJson(url[, opts])`
- `.postJson(url, data[, opts])`
- `.putJson(url, data[, opts])`
- `.patchJson(url, data[, opts])`
- `.deleteJson(url[, opts])`

### Parameters
- `data` can be an object, array or JSON string
- `opts.only2xx`: if set to `false`, will not throw error even for error codes other than 2xx. Defaults to `true`.
- `opts.skipParsing`: skip parsing of response into JSON, will return the `Response` object directly. Defaults to `false`.
