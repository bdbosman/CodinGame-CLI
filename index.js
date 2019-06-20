#!/usr/bin/env node

'use strict';

const { existsSync, readFileSync, writeFileSync } = require('fs');

const parseArgs = require('minimist');

const read = require('./testreader');
const run = require('./runner');
const { fatal, failed } = require('./errors');

const args = parseArgs(process.argv.slice(2), {
	alias: {
		t: 'test',
		s: 'size'
	}
});

if (existsSync('codin.config.json')) {
	const config = JSON.parse(readFileSync('codin.config.json'));
	for (const [ key, value ] of Object.entries(config)) {
		if (!args[key] || Array.isArray(args[key]) && args[key].length === 0) {
			args[key] = value;
		}
	}
}

const readTests = () => {
	if (args.test) {
		const testfiles = Array.isArray(args.test)
			? args.test
			: [ args.test ];

		return Promise.all(testfiles.map(read))
			.then(x => x.flat());
	}
	return Promise.resolve([]);
};

const main = tests => {
	for (const file of args._) {
		if (tests.length === 0) {
			const [ , stderr, code, error ] = run(file);
			if (code > 0 || error) {
				fatal(file, code, stderr, error);
			}
		} else {
			let n = 0;
			for (const { input, output: expected } of tests) {
				n++;
				const [ output, stderr, code, error ] =
					run(file, input.join('\n'));
				if (error) {
					fatal(file, code, stderr, error);
				}
				const troutput = output.trim();
				if (troutput !== expected.join('\n')) {
					failed(n, file, input, expected, troutput, stderr);
				}
			}
		}
	}
};

if (args.save) {
	writeFileSync('codin.config.json', JSON.stringify(args, null, '\t'));
}

if (args.size) {
	const files = Array.isArray(args.size)
		? args.size
		: [ args.size ];
	// eslint-disable-next-line global-require
	const { statSync } = require('fs');
	files.forEach(file =>
		console.log(
			file + ': ' +
			statSync(file).size + ' bytes'));
}

readTests().then(main);
