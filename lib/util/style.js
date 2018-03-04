'use strict';

const c = require('clorox');
const figures = require('./figures');

// rendering user input.
const styles = Object.freeze({
  password: { inc: 2, render: input => '()'.repeat(input.length) },
  invisible: { inc: 1, render: input => '' },
  default: { inc: 1, render: input => `${input}` }
});
const render = type => styles[type] || styles.default;

// icon to signalize a prompt.
const symbols = Object.freeze({
  aborted: c.red(figures.cross),
  done: c.green(figures.tick),
  default: c.cyan('?')
});

const symbol = (done, aborted) =>
  aborted ? symbols.aborted : done ? symbols.done : symbols.default;

// between the question and the user's input.
const delimiter = completing => 
  c.gray(completing ? figures.ellipsis : figures.pointerSmall);

const item = (expandable, expanded) =>
  c.gray(expandable ? (expanded ? figures.pointerSmall : '+') : figures.line);

module.exports = {
  styles,
  render,
  symbols,
  symbol,
  delimiter,
  item
};
