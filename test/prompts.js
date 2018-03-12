'use strict';

const test = require('tape');
const prompt = require('../lib');
const { prompts } = prompt;

test('basics', t => {
  t.plan(4);
  t.equal(typeof prompts, 'object');
  t.equal(typeof prompt, 'function');
  t.equal(typeof prompt.prompt, 'function');
  t.equal(typeof prompt.inject, 'function');
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

test('injects', async t => {
  let obj = { a:1, b:2, c:3 };
  prompt.inject(obj);
  t.same(prompt._map, obj, 'injects key:val object of answers');

  let foo = await prompt({ name:'a', message:'a' });
  t.same(foo, { a:1 }, 'immediately returns object with injected answer');
  t.same(prompt._map, { b:2, c:3 }, 'deletes the `a` key from internal map');

  let bar = await prompt([{ name:'b', message:'b' }, { name:'c', message:'b' }]);
  t.same(bar, { b:2, c:3 }, 'immediately handles two prompts at once');
  t.same(prompt._map, {}, 'leaves behind empty internal mapping when exhausted');

  t.end();
})

test('can use a function for message', async t => {
  let obj = { foo:'foo' };
  prompt.inject(obj);
  let foo = await prompt([{type:'text', name:'foo', message:() => 'functional message'}])
  t.same(foo, { foo:'foo' });
  t.end();
})