# Blooper

If you've written Node, you've written this:

```javascript
doSomething((error, data) => {
	if (error) {
		// handle error
	} else {
		// handle data
	}
});
```

With Blooper, you write one error handler, and your code looks like this:

```javascript
doSomething((error, data) => {
	blooper.handle(error).then(() => {
		// handle data
	});
});
```

This makes it easy to surface errors in the UI, log them and continue, or crash when appropriate.

## Usage

There are three things to know:
* To initialize Blooper, `require` it and pass it an error handler.
* The returned object has a `handle` method which will resolve a promise if the error is falsy, or else handle the error.
* There is also an `attempt` method that wraps try-catch (see below).

```javascript
let response;

const http = require('http'),
	blooper = require('blooper')((error, status = 500) => {
		// Put your error handling logic here
		console.error(error);
		response.writeHead(status, 'text/html; charset=UTF-8');
		response.end(error.stack || error);
	});

http.createServer((req, res) => {

	response = res;

	doSomething((err, data) => {
		blooper.handle(err).then(() => {
			// use data
		});
	});

	// You can wrap try/catch too!
	// By default, Blooper will catch using your error handler
	blooper.attempt(() => {
		doSomethingDangerous();
	});

	// Or you can pass a custom catcher
	blooper.attempt(() => {
		doSomethingDangerous();
	}, err => {
		// handle error here
	});

}).listen(3000);
```

## Using Blooper where you don't have a res object

The above examples only work because Blooper is configured in the same file that accepts requests. In order to use Blooper in other modules in your app, you need to give it access to the `res` object (assuming your error handler sends responses sometimes). For that, you have two options:

#### Attach Blooper to the request

Most apps pass around the request object already, so you can stick Blooper on there.

```javascript
let response;

const http = require('http'),
	blooper = require('blooper')((error, status = 500) => {
		// Put your error handling logic here
		console.error(error);
		response.writeHead(status, 'text/html; charset=UTF-8');
		response.end(error.stack || error);
	}),
	doSomething = require('./doSomething');

http.createServer((req, res) => {

	response = res;

	req.blooper = blooper;

	doSomething(req);

}).listen(3000);
```

#### Make Blooper global

Globals are generally a last resort, but I'll let you make an exception for Blooper, since it's really intended to be global in nature - it's use is to replace language constructs, after all.

```javascript
let response;

const http = require('http'),
	blooper = require('blooper')((error, status = 500) => {
		// Put your error handling logic here
		console.error(error);
		response.writeHead(status, 'text/html; charset=UTF-8');
		response.end(error.stack || error);
	});

global.handle = blooper.handle;

http.createServer((req, res) => {

	// ...

}).listen(3000);
```
