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
