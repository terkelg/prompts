'use strict';

const test = require('tape');
const { TP, k } = require('./util');
const { TextPrompt } = require('../lib').elements;

const opts = { render: true };

test('TextPrompt Class', t => {
  t.plan(1);
  t.equal(typeof TextPrompt, 'function');
});

test('TextPrompt submit', async t => {
  t.plan(2);
  let prompt = TP(TextPrompt, {message: 'text prompt'}, opts);
  let res = await prompt`hello world${k.ENTER}`;
  t.equal(res.value, 'hello world');
  t.equal(res.aborted, false);
});

test('TextPrompt reject', async t => {
  t.plan(2);
  let prompt = TP(TextPrompt, {message: 'text prompt'}, opts);
  let res = await prompt`val${k.ESC}`;
  t.equal(res.value, 'val');
  t.equal(res.aborted, true);
});
