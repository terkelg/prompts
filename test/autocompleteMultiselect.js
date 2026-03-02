'use strict';

const test = require('tape');
const { Writable, Readable } = require('stream');
const AutocompleteMultiselectPrompt = require('../lib/elements/autocompleteMultiselect');

// Mock stdin that doesn't need TTY
class MockStdin extends Readable {
  constructor() {
    super();
    this.isTTY = false;
  }
  _read() {}
  setRawMode() {}
}

// Mock stdout that captures output
class MockStdout extends Writable {
  constructor() {
    super();
    this.output = '';
    this.columns = 80;
  }
  _write(chunk, encoding, callback) {
    this.output += chunk.toString();
    callback();
  }
}

test('autocompleteMultiselect - handleSpaceToggle with empty filtered options', t => {
  t.plan(1);

  const stdin = new MockStdin();
  const stdout = new MockStdout();

  const prompt = new AutocompleteMultiselectPrompt({
    message: 'Test',
    choices: [
      { title: 'Foo', value: 'Foo' }
    ],
    stdin,
    stdout
  });

  // Simulate filtering that produces no results
  prompt.inputValue = 'xyz'; // No match
  prompt.updateFilteredOptions();

  // This should not throw - it should just bell()
  try {
    prompt.handleSpaceToggle();
    t.pass('handleSpaceToggle does not throw with empty filtered options');
  } catch (e) {
    t.fail(`handleSpaceToggle threw error: ${e.message}`);
  }

  prompt.close();
});

test('autocompleteMultiselect - left() with empty filtered options', t => {
  t.plan(1);

  const stdin = new MockStdin();
  const stdout = new MockStdout();

  const prompt = new AutocompleteMultiselectPrompt({
    message: 'Test',
    choices: [
      { title: 'Foo', value: 'Foo' }
    ],
    stdin,
    stdout
  });

  // Simulate filtering that produces no results
  prompt.inputValue = 'xyz'; // No match
  prompt.updateFilteredOptions();

  // This should not throw - it should just bell()
  try {
    prompt.left();
    t.pass('left() does not throw with empty filtered options');
  } catch (e) {
    t.fail(`left() threw error: ${e.message}`);
  }

  prompt.close();
});

test('autocompleteMultiselect - right() with empty filtered options', t => {
  t.plan(1);

  const stdin = new MockStdin();
  const stdout = new MockStdout();

  const prompt = new AutocompleteMultiselectPrompt({
    message: 'Test',
    choices: [
      { title: 'Foo', value: 'Foo' }
    ],
    stdin,
    stdout
  });

  // Simulate filtering that produces no results
  prompt.inputValue = 'xyz'; // No match
  prompt.updateFilteredOptions();

  // This should not throw - it should just bell()
  try {
    prompt.right();
    t.pass('right() does not throw with empty filtered options');
  } catch (e) {
    t.fail(`right() threw error: ${e.message}`);
  }

  prompt.close();
});

test('autocompleteMultiselect - space toggle still works with valid options', t => {
  t.plan(2);

  const stdin = new MockStdin();
  const stdout = new MockStdout();

  const prompt = new AutocompleteMultiselectPrompt({
    message: 'Test',
    choices: [
      { title: 'Foo', value: 'Foo' },
      { title: 'Bar', value: 'Bar' }
    ],
    stdin,
    stdout
  });

  // Should have all options available initially
  t.equal(prompt.filteredOptions.length, 2, 'has 2 filtered options initially');

  // Toggle selection - should not throw and should select the item
  prompt.handleSpaceToggle();
  t.equal(prompt.filteredOptions[0].selected, true, 'first option is selected after space toggle');

  prompt.close();
});
