'use strict';

const test = require('tape');
const prompt = require('../');
const { prompts } = prompt;

test('basics', t => {
  t.plan(4);
  t.equal(typeof prompts, 'object');
  t.equal(typeof prompt, 'function');
  t.equal(typeof prompt.prompt, 'function');
  t.equal(typeof prompt.inject, 'function');
});

test('prompts', t => {
  t.plan(25);

  const types = [
    'text',
    'password',
    'invisible',
    'number',
    'confirm',
    'list',
    'toggle',
    'select',
    'multiselect',
    'autocompleteMultiselect',
    'autocomplete',
    'date'
  ];

  types.forEach(p => {
    t.true(p in prompts, `${prompts[p].name} exists`);
    t.equal(typeof prompts[p], 'function', `${prompts[p].name} is typeof function`);
  });

  t.equal(Object.keys(prompts).length, types.length, 'all prompts are exported');
});

test('injects', t => {
  let injected = [ 1, 2, 3 ];
  prompt.inject(injected);
  t.same(prompt._injected, injected, 'injects array of answers');

  prompt({ type: 'text', name:'a', message: 'a message' })
    .then(foo => {
      t.same(foo, { a:1 }, 'immediately returns object with injected answer');
      t.same(prompt._injected, [ 2, 3 ], 'deletes the first answer from internal array');

      prompt([{ type: 'text', name:'b', message: 'b message' }, { type: 'text', name:'c', message: 'c message' }])
        .then(bar => {
          t.same(bar, { b:2, c:3 }, 'immediately handles two prompts at once');
          t.same(prompt._injected, [], 'leaves behind empty internal array when exhausted');
          t.end();
        });
    });
});

test('retries injected answers that fail validation', t => {
  t.teardown(() => { delete prompt._injected; });
  const formatted = [];
  const submitted = [];
  prompt.inject(['a', 'abc', undefined]);

  prompt([
    {
      type: 'text',
      name: 'first',
      message: 'Enter at least two characters',
      validate: value => value.length > 1,
      format: value => {
        formatted.push(value);
        return value.toUpperCase();
      }
    },
    {
      type: 'text',
      name: 'second',
      message: 'Enter another answer',
      initial: 'default',
      validate: value => value === 'default'
    }
  ], {
    onSubmit: (question, answer) => { submitted.push([question.name, answer]); }
  }).then(answers => {
    t.same(answers, { first: 'ABC', second: 'default' }, 'retries the same question and uses the next answer for the next question');
    t.same(formatted, ['abc'], 'formats only the accepted answer');
    t.same(submitted, [['first', 'ABC'], ['second', 'default']], 'submits each question only once');
    t.end();
  }).catch(err => t.end(err));
});

test('awaits injected answer validation', t => {
  t.teardown(() => { delete prompt._injected; });
  prompt.inject(['short', 'longer']);

  prompt({
    type: 'text',
    name: 'answer',
    message: 'Enter at least six characters',
    validate: async value => value.length >= 6 || 'Too short'
  }).then(answers => {
    t.same(answers, { answer: 'longer' }, 'retries when an async validator returns an error message');
    t.end();
  }).catch(err => t.end(err));
});

test('cancels when no injected answer passes validation', t => {
  t.teardown(() => { delete prompt._injected; });
  const cancelled = [];
  prompt.inject(['keep', 'a']);

  prompt([
    { type: 'text', name: 'first', message: 'Enter an answer' },
    {
      type: 'text',
      name: 'second',
      message: 'Enter at least two characters',
      initial: 'default',
      validate: value => value.length > 1
    }
  ], {
    onCancel: question => { cancelled.push(question.name); }
  }).then(answers => {
    t.same(answers, { first: 'keep' }, 'keeps earlier answers and omits the rejected answer');
    t.same(cancelled, ['second'], 'cancels the unanswered question when the queue is exhausted');
    t.end();
  }).catch(err => t.end(err));
});
