#!/usr/bin/env node

'use strict';

const parseArgs = require('minimist');

const read = require('./testreader');
const run = require('./runner');
const { fatal, failed } = require('./errors');

const args = parseArgs(process.argv.slice(2), {
	alias: { t: 'test' }
});

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

readTests().then(main);
