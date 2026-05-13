'use strict';

const test = require('tape');
const ConfirmPrompt = require('../lib/elements/confirm');

test('does not crash on non-string key (e.g. function keys)', (t) => {
  t.plan(1);
  const confirmPrompt = new ConfirmPrompt({ message: 'x' });
  t.doesNotThrow(() => confirmPrompt._(undefined, { name: 'f2' }), 'undefined character handled');
  confirmPrompt.close();
});

test('accepts "y" to submit true', (t) => {
  t.plan(2);
  const confirmPrompt = new ConfirmPrompt({ message: 'x' });
  confirmPrompt._('y', { name: 'y' });
  t.equal(confirmPrompt.value, true, 'value is true after pressing y');
  t.equal(confirmPrompt.done, true, 'prompt is done after pressing y');
});

test('accepts "n" to submit false', (t) => {
  t.plan(2);
  const confirmPrompt = new ConfirmPrompt({ message: 'x' });
  confirmPrompt._('n', { name: 'n' });
  t.equal(confirmPrompt.value, false, 'value is false after pressing n');
  t.equal(confirmPrompt.done, true, 'prompt is done after pressing n');
});
