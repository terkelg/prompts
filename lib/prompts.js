'use strict';

const el = require('./elements');

/**
 * Text prompt
 * @param {string} message Prompt message to display
 * @param {string} [initial] Default string value
 * @param {string} [style="default"] Render style ('default', 'password', 'invisible')
 * @returns {Promise} Promise with user input
 */
function text({ message, initial, style }) {
  if (typeof message !== 'string') throw new Error('message is required');
  return new Promise((resolve, reject) => {
    const p = new el.TextPrompt({ message, initial, style });
    p.on('submit', resolve);
    p.on('abort', reject);
  });
}

/**
 * Password prompt with masked input
 * @param {string} message Prompt message to display
 * @param {string} [initial] Default string value
 * @returns {Promise} Promise with user input
 */
const password = ({ message, initial }) => text({ message, initial, style: 'password' });

/**
 * Prompt where input is invisible, like sudo
 * @param {string} message Prompt message to display
 * @param {string} [initial] Default string value
 * @returns {Promise} Promise with user input
 */
const invisible = ({ message, initial }) => text({ message, initial, style: 'invisible' });

/**
 * Number prompt
 * @param {string} message Prompt message to display
 * @param {number} initial Default number value
 * @param {number} [max] Max value
 * @param {number} [min] Min value
 * @param {string} [style="default"] Render style ('default', 'password', 'invisible')
 * @returns {Promise} Promise with user input
 */
function number({ message, initial, max, min, style }) {
  if (typeof message !== 'string') throw new Error('message is required');
  return new Promise((resolve, reject) => {
    const p = new el.NumberPrompt({ message, initial, max, min, style });
    p.on('submit', resolve);
    p.on('abort', reject);
  });
}

/**
 * Classic yes/no prompt
 * @param {string} message Prompt message to display
 * @param {boolean} [initial=false] Default value
 * @returns {Promise} Promise with user input
 */
function confirm({ message, initial }) {
  if (typeof message !== 'string') throw new Error('message is required');
  return new Promise((resolve, reject) => {
    const p = new el.ConfirmPrompt({ message, initial });
    p.on('submit', resolve);
    p.on('abort', reject);
  });
}

/**
 * List prompt, split intput string by `seperator`
 * @param {string} message Prompt message to display
 * @param {string} [initial] Default string value
 * @param {string} [style="default"] Render style ('default', 'password', 'invisible')
 * @param {string} [separator] String separator
 * @returns {Promise} Promise with user input, in form of an `Array`
 */
function list({ message, initial, style, separator = ',' }) {
  if (typeof message !== 'string') throw new Error('message is required');
  return new Promise((resolve, reject) => {
    const p = new el.TextPrompt({ message, initial, style });
    p.on('submit', str => resolve(str.split(separator).map(s => s.trim())));
    p.on('abort', reject);
  });
}

/**
 * Toggle/switch prompt
 * @param {string} message Prompt message to display
 * @param {boolean} [initial=false] Default value
 * @param {string} [active="on"] Text for `active` state
 * @param {string} [inactive="off"] Text for `inactive` state
 * @returns {Promise} Promise with user input
 */
function toggle({ message, initial, active, inactive }) {
  if (typeof message !== 'string') throw new Error('message is required');
  return new Promise((resolve, reject) => {
    const p = new el.TogglePrompt({ message, initial, active, inactive });
    p.on('submit', resolve);
    p.on('abort', reject);
  });
}

/**
 * Interactive select prompt
 * @param {string} message Prompt message to display
 * @param {Array} choices Array of choices objects `[{ title, value }, ...]`
 * @param {number} [initial] Index of default value
 * @returns {Promise} Promise with user input
 */
function select({ message, choices, initial }) {
  if (typeof message !== 'string') throw new Error('message is required');
  return new Promise((resolve, reject) => {
    const p = new el.SelectPrompt({ message, choices, initial });
    p.on('submit', resolve);
    p.on('abort', reject);
  });
}

/**
 * Interactive multi-select prompt
 * @param {string} message Prompt message to display
 * @param {Array} choices Array of choices objects `[{ title, value, [selected] }, ...]`
 * @param {number} [max] Max select
 * @param {string} [hint] Hint to display user
 * @returns {Promise} Promise with user input
 */
function multiselect({ message, choices, max, hint }) {
  if (typeof message !== 'string') throw new Error('message is required');
  if (!Array.isArray(choices)) throw new Error('choices array is required');

  return new Promise((resolve, reject) => {
    const p = new el.MultiselectPrompt({ message, choices, max, hint });
    const selected = items => items.filter(item => item.selected).map(item => item.value);
    p.on('submit', items => resolve(selected(items)));
    p.on('abort', items => reject(selected(items)));
  });
}

/**
 * Interactive multi-select prompt
 * @param {string} message Prompt message to display
 * @param {Array} choices Array of auto-complete choices objects `[{ title, value }, ...]`
 * @param {Function} [suggest] Function to filter results based on user input. Defaults to stort by `title`
 * @param {number} [limit=10] Max number of results to show
 * @param {string} style Render style ('default', 'password', 'invisible')
 * @returns {Promise} Promise with user input
 */
function autocomplete({ message, choices, suggest, limit, style }) {
  if (typeof message !== 'string') throw new Error('message is required');
  if (!Array.isArray(choices)) throw new Error('choices array is required');
  const suggestByTitle = (input, choices) =>
    Promise.resolve(
      choices.filter(
        item => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()
      )
    );
  suggest = suggest ? suggest : suggestByTitle;
  return new Promise((resolve, reject) => {
    const p = new el.AutocompletePrompt({ message, choices, suggest, limit, style });
    p.on('submit', resolve);
    p.on('abort', reject);
  });
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
