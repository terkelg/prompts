'use strict';

const color = require('clorox');
const Prompt = require('./prompt');
const { cursor } = require('sisteransi');
const { clear, figures, style } = require('../util');

/**
 * A prompt to select zero or more items.
 */
class MultiselectPrompt extends Prompt {
  constructor({ message, choices, max, hint, cursor = 0 }) {
    super();
    this.msg = message;
    this.hint = hint;
    this.cursor = cursor;
    this.hint = hint || '- Space to select. Return to submit';
    this.maxChoices = max;
    this.value = choices.map(v => {
      return Object.assign({ title: v.value, selected: false }, v);
    });
    this.clear = clear('');
    this.render(true);
  }

  reset() {
    this.value.map(v => !v.selected);
    this.cursor = 0;
    this.fire();
    this.render();
  }

  selected() {
    return this.value.filter(v => v.selected);
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

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.value.length - 1;
    this.render();
  }
  next() {
    this.cursor = (this.cursor + 1) % this.value.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) return this.bell();
    this.cursor--;
    this.render();
  }

  down() {
    if (this.cursor === this.value.length - 1) return this.bell();
    this.cursor++;
    this.render();
  }

  left() {
    this.value[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.value[this.cursor].selected = true;
    this.render();
  }

  _(c, key) {
    if (c !== ' ') return this.bell();
    const v = this.value[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  render(first) {
    if (first) this.out.write(cursor.hide);

    // print prompt
    const selected = this.value
      .filter(e => e.selected)
      .map(v => v.title)
      .join(', ');
    let prompt = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(false),
      this.done ? selected : color.gray(this.hint)
    ].join(' ');

    // print choices
    if (!this.done) {
      const c = this.cursor;
      prompt +=
        '\n' +
        this.value
          .map(
            (v, i) =>
              (v.selected ? color.green(figures.tick) : ' ') +
              ' ' +
              (c === i ? color.cyan.underline(v.title) : v.title)
          )
          .join('\n');
    }

    this.out.write(this.clear + prompt);
    this.clear = clear(prompt);
  }
}

module.exports = MultiselectPrompt;
