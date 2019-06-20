'use strict';

const { createInterface } = require('readline');

const rl = createInterface({ input: process.stdin });

rl.once('line', line => {
	process.stdout.write(line);
	process.stdin.pause();
});
