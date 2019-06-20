#!/usr/bin/env node

'use strict';

const { resolve } = require('path');
const { spawnSync } = require('child_process');

const readline = () => {
	const { stdout } = spawnSync(
		'node',
		[ resolve('readline.js') ],
		{ stdio: [ 'inherit', 'pipe', 'ignore' ] });
	return String(stdout);
};

global.readline = readline;

require(resolve(process.argv[2]));
