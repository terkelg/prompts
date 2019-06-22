'use strict';

const ESC = '\x1b';

module.exports = {
  save: ESC + '7',
  restore: ESC + '8'
};
