'use strict';

const elements = require('../../lib/elements');

const k = {
  ENTER: {name: 'enter', ctrl: false},
  RETURN: {name: 'return', ctrl: false},
  ESC: {name: 'escape', ctrl: false},
  TAB: {name: 'next', ctrl: false},
  ABORT: {name: 'abort', ctrl: false},
  BACKSPACE: {name: 'backspace', ctrl: false},
  DOWN: {name: 'down', ctrl: false},
  UP: {name: 'down', ctrl: false},
  LEFT: {name: 'left', ctrl: false},
  RIGHT: {name: 'right', ctrl: false},
  FIRST: {name: 'a', ctrl: true},
  LAST: {name: 'e', ctrl: true},
  RESET: {name: 'g', ctrl: true}
}

const delay = time => new Promise(res => setTimeout(() => res(), time));

/**
 * Wrap a prompt for easy testing.
 * Use template literals to mock stdin.
 * @param {Class} Prompt prompt class to test
 * @param {Object} props prompt options
 * @param {Object} [options] test options
 * @param {Boolean} [options.render=true] set to fale to not render the prompt
 * @returns {Promise} resolved/rejected value
 */
function TP(Prompt, props, { render = true } = {}) {
  return (text, ...keys) => {
    return new Promise(resolve => {

      let noop = () => {};
      Prompt.prototype.render = () => {};

      let prompt = new Prompt(props);
      prompt.out = { write: noop }
      prompt.in = { on: noop, removeListener: noop, setRawMode: noop }

      let keypress = prompt.__keypress;
      prompt.on('submit', value => resolve({ value, aborted: false }));
      prompt.on('abort', value => resolve({ value, aborted: true }));

      delay(10).then(() => text.forEach((part, i) => keypress(part, keys[i-1] || { ctrl: false })))
    })
  }
}

module.exports = { TP, k }
