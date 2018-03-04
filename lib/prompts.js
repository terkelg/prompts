'use strict';

const el = require('./elements');
const noop = v => v;

function toPrompt(type, args, opts={}) {
  return new Promise((res, rej) => {
    const p = new el[type](args);
    const onAbort = opts.onAbort || noop;
    const onSubmit = opts.onSubmit || noop;
    p.on('state', args.onState || noop);
    p.on('submit', x => res(onSubmit(x)));
    p.on('abort', x => rej(onAbort(x)));
  });
}

/**
 * Text prompt
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {function} [args.onState] On state change callback
 * @returns {Promise} Promise with user input
 */
function text(args) {
  return toPrompt('TextPrompt', args);
}

/**
 * Password prompt with masked input
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {function} [args.onState] On state change callback
 * @returns {Promise} Promise with user input
 *
 */
function password(args) {
  args.style = 'password';
  return text(args);
}

/**
 * Prompt where input is invisible, like sudo
 * @param {string} opts.message Prompt message to display
 * @param {string} [opts.initial] Default string value
 * @param {function} [opts.onState] On state change callback
 * @returns {Promise} Promise with user input
 */
function invisible(opts) {
  opts.style = 'invisible';
  return text(opts);
}

/**
 * Number prompt
 * @param {string} args.message Prompt message to display
 * @param {number} args.initial Default number value
 * @param {number} [args.max] Max value
 * @param {number} [args.min] Min value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {function} [args.onState] On state change callback
 * @returns {Promise} Promise with user input
 */
function number(args) {
  return toPrompt('NumberPrompt', args);
}

/**
 * Classic yes/no prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {function} [args.onState] On state change callback
 * @returns {Promise} Promise with user input
 */
function confirm(args) {
  return toPrompt('ConfirmPrompt', args);
}

/**
 * List prompt, split intput string by `seperator`
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {string} [args.separator] String separator
 * @param {function} [args.onState] On state change callback
 * @returns {Promise} Promise with user input, in form of an `Array`
 */
function list(args) {
  const sep = args.separator || ',';
  return toPrompt('TextPrompt', args, {
    onSubmit: str => str.split(sep).map(s => s.trim())
  });
}

/**
 * Toggle/switch prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {string} [args.active="on"] Text for `active` state
 * @param {string} [args.inactive="off"] Text for `inactive` state
 * @param {function} [args.onState] On state change callback
 * @returns {Promise} Promise with user input
 */
function toggle(args) {
  return toPrompt('TogglePrompt', args);
}

/**
 * Interactive select prompt
 * @param {string} arr.message Prompt message to display
 * @param {Array} arr.choices Array of choices objects `[{ title, value }, ...]`
 * @param {number} [arr.initial] Index of default value
 * @param {function} [arr.onState] On state change callback
 * @returns {Promise} Promise with user input
 */
function select(args) {
  return toPrompt('SelectPrompt', args);
}

/**
 * Interactive multi-select prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
 * @param {number} [args.max] Max select
 * @param {string} [args.hint] Hint to display user
 * @param {function} [args.onState] On state change callback
 * @returns {Promise} Promise with user input
 */
function multiselect(args) {
  if (!Array.isArray(args.choices)) throw new Error('choices array is required');
  const toSelected = items => items.filter(item => item.selected).map(item => item.value);
  return toPrompt('MultiselectPrompt', args, {
    onAbort: toSelected,
    onSubmit: toSelected
  });
}

/**
 * Interactive multi-select prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
 * @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
 * @param {number} [args.limit=10] Max number of results to show
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {function} [args.onState] On state change callback
 * @returns {Promise} Promise with user input
 */
function autocomplete(args) {
  if (!Array.isArray(args.choices)) throw new Error('choices array is required');
  args.suggest = args.suggest || byTitle;
  return toPrompt('AutocompletePrompt', args);
}

function byTitle(input, choices) {
  return Promise.resolve(
    choices.filter(item => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase())
  );
}

module.exports = {
  text,
  password,
  invisible,
  number,
  confirm,
  list,
  toggle,
  select,
  multiselect,
  autocomplete
};
