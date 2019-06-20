'use strict';

const { join } = require('path');
const { spawnSync } = require('child_process');

const run = (input, path) => {
	const { stdout } = spawnSync(
		'node',
		[
			'-r', join(__dirname, 'setup.js'),
			path
		],
		{ input });
	return String(stdout);
};

module.exports = run;
