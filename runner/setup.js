'use strict';

const { join } = require('path');

global.readline = require(join(__dirname, '..', 'readline'));
// eslint-disable-next-line no-console
global.print = console.log.bind(console);
