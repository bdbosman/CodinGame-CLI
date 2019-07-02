'use strict';

const { readSync } = require('fs');

const readline = () => {
	let line = '';
	let char = '';
	const buf = Buffer.alloc(1);
	while (char !== '\r' && char !== '\n') {
		line += char;
		try {
			const bytesRead = readSync(process.stdin.fd, buf, 0, 1);
			if (bytesRead === 0) {
				return line;
			}
		} catch (err) {
			if (err.code === 'EOF') {
				return line;
			}
			continue;
		}
		char = String(buf);
	}
	return line;
};

module.exports = readline;
