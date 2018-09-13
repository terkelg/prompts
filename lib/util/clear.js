'use strict';

const { erase, cursor } = require('sisteransi');

module.exports = function (prompt, perLine = true) {
  if (!perLine) return erase.line + cursor.to(0);
  let nbLines = prompt.split(/\r?\n/).length;
  // TODO add \u001b[J to sisteransi
  return cursor.prevLine(nbLines - 1) + cursor.to(0) + "\u001b[J";
};
