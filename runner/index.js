'use strict';

const { platform } = require('os');
const { join, extname } = require('path');
const { spawnSync } = require('child_process');

const runners = {
	js: (path, input) => {
		const { stdout, stderr } = spawnSync(
			'node',
			[
				'-r', join(__dirname, 'setup.js'),
				path
			],
			input
				? { input }
				: { stdio: 'inherit' });
		return [ String(stdout), String(stderr) ];
	},
	ts: (path, input) => {
		const { stdout, stderr } = spawnSync(
			platform() === 'win32'
				? 'cmd'
				: 'ts-node',
			[
				...platform() === 'win32'
					? [ '/c', 'ts-node' ]
					: [],
				'-r', join(__dirname, 'setup.js'),
				path
			],
			input
				? { input }
				: { stdio: 'inherit' });
		return [ String(stdout), String(stderr) ];
	}
};

const run = (path, input = null) => {
	const type = extname(path).slice(1);
	if (type in runners) {
		return runners[type](path, input);
	}
	throw new TypeError('Unknown file type: ' + type);
};

module.exports = run;
