'use strict';

const { createReadStream } = require('fs');
const { createInterface } = require('readline');

const read = async path => {
	const rl = createInterface(createReadStream(path));
	const tests = [
		{ input: [], output: [] }
	];
	let [ current ] = tests;
	let mode = '';
	for await (const line of rl) {
		if (line.trim().toLowerCase() === 'input:') {
			if (mode === 'output') {
				const next = { input: [], output: [] };
				tests.push(next);
				current = next;
			}
			mode = 'input';
			continue;
		}
		if (line.trim().toLowerCase() === 'output:') {
			mode = 'output';
			continue;
		}
		if (line.length > 0 && mode.length > 0 && !line.startsWith('#')) {
			current[mode].push(line);
		}
	}
	return tests;
};

module.exports = read;
