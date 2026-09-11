'use strict';

const test = require('tape');
const { PassThrough } = require('stream');
const AutocompleteMultiselectPrompt = require('../lib/elements/autocompleteMultiselect');

function createPrompt(choices) {
  const stdin = new PassThrough();
  const stdout = new PassThrough();
  stdout.columns = 80;
  return new AutocompleteMultiselectPrompt({
    message: 'Pick',
    choices,
    stdin,
    stdout
  });
}

test('autocompleteMultiselect renders highlighted choice description', t => {
  t.plan(1);

  const prompt = createPrompt([
    { title: 'test', value: 'test', description: 'test description' }
  ]);

  const highlighted = prompt.renderOption(0, prompt.value[0], 0, ' ');
  t.ok(highlighted.includes('test description'), 'highlighted option shows description');

  prompt.abort();
  t.end();
});
