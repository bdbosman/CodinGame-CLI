'use strict';

const { platform } = require('os');
const { join, extname, basename } = require('path');
const { spawnSync } = require('child_process');

const spawn = (command, args, input) => {
	const { stdout, stderr, status, error } = spawnSync(
		command,
		args,
		input ? { input } : { stdio: 'inherit' });
	return [
		stdout ? String(stdout) : stdout,
		stderr ? String(stderr) : stderr,
		status,
		error
	];
};

const runners = {
	js: (path, input) =>
		spawn('node', [
			'-r', join(__dirname, 'setup.js'), path
		], input),
	ts: (path, input) =>
		spawn(platform() === 'win32' ? 'cmd' : 'ts-node', [
			...platform() === 'win32'
				? [ '/c', 'ts-node' ]
				: [],
			'-r', join(__dirname, 'setup.js'), path
		], input),
	hs: (path, input) =>
		spawn('runhaskell', [ path ], input)
};

const run = (path, input = null) => {
	const type = extname(path).slice(1);
	if (type in runners) {
		return runners[type](path, input);
	}
	throw new TypeError('Unknown file type:', type);
};

module.exports = run;
