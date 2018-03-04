'use strict';

const util = require('../util');
const color = require('clorox');
const Prompt = require('./prompt');
const { cursor } = require('sisteransi');

// Get value, with fallback to title
const getVal = (arr, i) => arr[i].value || arr[i].title || arr[i];

/**
 * A command line prompt with autocompletion
 */
class AutocompletePrompt extends Prompt {
  constructor({ message, suggest, choices, cursor = 0, limit = 10, style = 'default' }) {
    super();
    this.msg = message;
    this.suggest = suggest;
    this.choices = choices;
    this.suggestions = [];
    this.input = '';
    this.limit = limit;
    this.cursor = cursor;
    this.transform = util.style.render(style);
    this.render = this.render.bind(this);
    this.complete = this.complete.bind(this);
    this.clear = util.clear('');
    this.complete(this.render);
    this.render(true);
  }

  moveCursor(i) {
    this.cursor = i;
    if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);
    else this.value = null;
    this.fire();
  }

  async complete(cb) {
    const p = (this.completing = this.suggest(this.input, this.choices));
    const suggestions = await p;

    if (this.completing !== p) return;

    this.suggestions = suggestions.slice(0, this.limit).map(s => util.strip(s));
    this.completing = false;

    const l = Math.max(suggestions.length - 1, 0);
    this.moveCursor(Math.min(l, this.cursor));

    cb && cb();
  }

  reset() {
    this.input = '';
    this.complete(() => {
      this.moveCursor(0);
      this.render();
    });
    this.render();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  _(c, key) {
    this.input += c;
    this.complete(this.render);
    this.render();
  }

  delete() {
    if (this.input.length === 0) return this.bell();
    this.input = this.input.slice(0, -1);
    this.complete(this.render);
    this.render();
  }

  first() {
    this.moveCursor(0);
    this.render();
  }

  last() {
    this.moveCursor(this.suggestions.length - 1);
    this.render();
  }

  up() {
    if (this.cursor <= 0) return this.bell();
    this.moveCursor(this.cursor - 1);
    this.render();
  }

  down() {
    if (this.cursor >= this.suggestions.length - 1) return this.bell();
    this.moveCursor(this.cursor + 1);
    this.render();
  }

  next() {
    this.moveCursor((this.cursor + 1) % this.suggestions.length);
    this.render();
  }

  render(first) {
    if (first) this.out.write(cursor.hide);

    let prompt = [
      util.style.symbol(this.done, this.aborted),
      this.msg,
      util.style.delimiter(this.completing),
      this.done && this.suggestions[this.cursor]
        ? this.suggestions[this.cursor].title
        : this.transform.render(this.input)
    ].join(' ');

    if (!this.done) {
      for (let i = 0; i < this.suggestions.length; i++) {
        const s = this.suggestions[i];
        prompt += '\n' + (i === this.cursor ? color.cyan(s.title) : s.title);
      }
    }

    this.out.write(this.clear + prompt);
    this.clear = util.clear(prompt);
  }
}

module.exports = AutocompletePrompt;
