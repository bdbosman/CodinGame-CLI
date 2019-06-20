#!/usr/bin/env node

'use strict';

const parseArgs = require('minimist');
const chalk = require('chalk');

const read = require('./testreader');
const run = require('./runner');

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
			run(file);
		} else {
			let n = 0;
			for (const { input, output: expected } of tests) {
				n++;
				const [ output, error ] = run(file, input.join('\n'));
				const troutput = output.trim();
				if (troutput !== expected.join('\n')) {
					console.error(
						// eslint-disable-next-line indent
`${chalk.red(`${file}: Test #${n} failed`)}
  Input:
    ${input.join('\n    ')}
  Expected output:
    ${expected.join('\n    ')}
  Actual output:
    ${troutput.split('\n').join('\n    ') +
		(error
			? '\n  Error output:\n    ' + error.split('\n').join('\n    ')
			: '')}`);
				}
			}
		}
	}
};

readTests().then(main);
