'use strict';

const chalk = require('chalk');

const fatal = (file, code, stderr, error) => {
	console.error(
		chalk.red(
			file + ': ' +
			(code
				? 'exited with code: ' + code
				: 'failed!') + '\n' +
			(stderr
				? '\n  Error output:\n    ' + stderr.split('\n').join('\n    ')
				: '')));
	if (error) {
		console.error(chalk.red('Error: ' + error.message));
	}
};

const indent = (n, code) => {
	const level = ' '.repeat(n);
	const lines = Array.isArray(code) ? code : (code || '').split('\n');
	return level + lines.join('\n' + level);
};

const failed = (n, file, input, expected, actual, stderr) => {
	console.error(chalk.red(file + ': Test #' + n + ' failed!'));
	if (input) {
		console.error(chalk.gray('  Input:\n') + indent(4, input));
	}
	if (expected) {
		console.error(chalk.gray('  Expected output:\n') + indent(4, expected));
	}
	console.error(chalk.gray('  Actual output:\n') + indent(4, actual));
	if (stderr) {
		console.error(chalk.gray('  Error output:\n') + indent(4, stderr));
	}
};

module.exports = { fatal, failed };
