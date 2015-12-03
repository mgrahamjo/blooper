'use strict';

let error, status;

const blooper = require('../dist/blooper')((err, stat) => {
	error = err;
	status = stat;
});

exports.handle = test => {
	blooper.handle('foo', 404).then(() => {
		test.ok(false);
	});

	test.ok(error === 'foo');
	test.ok(status === 404);
	test.done();
};

exports.attemptPassThrough = test => {
	blooper.attempt(() => {
		throw 'bar';
	});

	test.ok(error === 'bar');
	test.done();
};

exports.attemptCustomCatcher = test => {
	blooper.attempt(() => {
		throw 'baz';
	}, (err) => {
		test.ok(err === 'baz');
		error = 'caught';
	});

	test.ok(error === 'caught');
	test.done();
};