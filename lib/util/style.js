'use strict';

const c = require('kleur');
const figures = require('./figures');

// rendering user input.
const styles = Object.freeze({
  password: { scale: 1, render: input => '*'.repeat(input.length) },
  emoji: { scale: 2, render: input => '😃'.repeat(input.length) },
  invisible: { scale: 0, render: input => '' },
  default: { scale: 1, render: input => `${input}` }
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


// Global "default theme" collection, shared by all elements (although
// not all elements make use of every style).
const normal = s => s;
const defaultTheme = {
  // Message (prompt text)
  message: c.bold,

  // Placeholder text (default values)
  placeholder: c.gray,

  // Text entry
  text: normal,

  // Selected text. Used for selected titles of drop-down lists
  // and autocompletion lists, for "field" text (like in date picker),
  // or for validated values (like number entry).
  textSelected: c.cyan().underline,

  // Error text (user input flagged as an error)
  textError: c.red().underline,

  // Disabled text. Used for disabled titles in list elements.
  textDisabled: c.gray().strikethrough,

  // Disabled but selected text. (Again, list elements.)
  textDisabledSelected: c.gray().underline,

  // Final text (displaying an answered prompt)
  textFinal: c.magenta,

  // Error messages, validation failures, etc.
  error: c.red().italic,

  // Hints and additional secondary information
  hint: c.gray,

  // Warnings and urgent notifications
  warn: c.yellow,

  // Cursor color (pointers used in list elements).
  cursor: c.cyan,

  // Disabled cursors (list elements).
  cursorDisabled: c.gray().bold,

  // Selected radio buttons
  radioSelected: c.green
};

module.exports = {
  styles,
  render,
  symbols,
  symbol,
  delimiter,
  item,
  defaultTheme
};
