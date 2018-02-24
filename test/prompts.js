'use strict';

const test = require('tape');
const { prompts, prompt } = require('../lib');

test('basics', t => {
  t.plan(2);
  t.equal(typeof prompt, 'function');
  t.equal(typeof prompts, 'object');
});

test('prompts', t => {
  t.plan(21);

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
    'autocomplete'
  ];

  types.forEach(p => {
    t.true(p in prompts, `${prompts[p].name} exists`);
    t.equal(typeof prompts[p], 'function', `${prompts[p].name} is typeof function`);
  });

  t.equal(Object.keys(prompts).length, types.length, 'all prompts are exported');
});
