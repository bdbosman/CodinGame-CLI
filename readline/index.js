'use strict';

const { readSync } = require('fs');

const readline = () => {
	let line = '';
	let char = '';
	const buf = Buffer.alloc(1);
	while (char !== '\r' && char !== '\n') {
		line += char;
		try {
			readSync(process.stdin.fd, buf, 0, 1);
		} catch (err) {
			return line;
		}
		char = String(buf);
	}
	return line;
};

module.exports = readline;
