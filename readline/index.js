'use strict';

const { join } = require('path');
const { spawnSync } = require('child_process');

const readline = () => {
	const { stdout } = spawnSync(
		'node',
		[ join(__dirname, 'child.js') ],
		{ stdio: [ 'inherit', 'pipe', 'ignore' ] });
	return String(stdout);
};

module.exports = readline;
