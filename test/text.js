'use strict';

const test = require('tape');
const TextPrompt = require('../lib/elements/text');

test('move', (t) => {
  t.plan(6);

  const textPrompt = new TextPrompt();
  textPrompt.value = 'Hello, world!';
  textPrompt.last()
  textPrompt.render()

  t.same(textPrompt.cursorOffset, 0, 'cursorOffset is 0 at start');
  t.same(textPrompt.cursor, textPrompt.rendered.length, 'cursor starts at 0')

  textPrompt.right();
  t.same(textPrompt.cursorOffset, 0, 'cursorOffset is unaffected when moved right from the end');
  t.same(textPrompt.cursor, textPrompt.rendered.length, 'cursor is unaffected when moved right from the end')

  textPrompt.left();
  t.equal(textPrompt.cursorOffset, -1, 'cursorOffset is -1 when moved left');

  textPrompt.right();
  t.equal(textPrompt.cursorOffset, 0, 'cursorOffset is 0 when moved left');

  t.end();
});

test('delete', (t) => {
  t.plan(4);

  const textPrompt = new TextPrompt();
  textPrompt.value = 'Hello, world!';
  textPrompt.last();
  textPrompt.render();

  textPrompt.delete();
  t.same(textPrompt.cursorOffset, 0, 'cursorOffset is 0 after delete');
  t.same(textPrompt.cursor, textPrompt.rendered.length, 'cursor stays at end of line')

  textPrompt.left();
  textPrompt.deleteForward()
  t.same(textPrompt.cursorOffset, 0, 'cursorOffset is 0 after deleteForward');
  t.same(textPrompt.cursor, textPrompt.rendered.length, 'cursor stays at end of line')

  textPrompt.submit();
  t.end()
});

test('submit', (t) => {
  t.plan(2)
  const textPrompt = new TextPrompt();
  textPrompt.value = 'Hello, world!';
  textPrompt.submit()

  t.same(textPrompt.cursorOffset, 0, 'cursorOffset is reset on submit')
  t.same(textPrompt.cursor, textPrompt.rendered.length, 'cursor is reset to end of line on submit')
})
