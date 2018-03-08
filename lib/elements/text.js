const color = require('clorox');
const Prompt = require('./prompt');
const { cursor } = require('sisteransi');
const { style: stl, clear } = require('../util');

class TextPrompt extends Prompt {
  constructor({ message, cursor, initial, style = 'default' }) {
    super();

    initial = 'hello world';

    this.transform = stl.render(style);
    this.scale = this.transform.scale;

    this.msg = message;
    this.value = initial || '';
    this.initialValue = initial;
    this.cursor = this.rendered.length || 1;

    this.clear = clear('');
    this.render();
  }

  set value(v) {
    this._value = v;
    this.rendered = this.transform.render(v);
    this.cursor =  Math.min(this.rendered.length, this.cursor);
    this.fire();
  }

  get value() {
    return this._value;
  }

  reset() {
    this.value = '';
    this.fire();
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
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor);
    this.cursor++;
    this.value = `${s1}${c}${s2}`;
    this.render();
  }

  delete() {
    if (this.value.length === 0) return this.bell();
    this.cursor--;
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor+1);
    this.value = `${s1}${s2}`;
    this.render();
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.rendered.length;
    this.render();
  }

  left() {
    if (this.cursor <= 0) return this.bell();
    this.cursor--;
    this.render();
  }

  right() {
    if (this.cursor*this.scale >= this.rendered.length) return this.bell();
    this.cursor++;
    this.render();
  }

  render() {
    const prompt = [
      stl.symbol(this.done, this.aborted),
      color.bold(this.msg),
      stl.delimiter(this.done),
      this.rendered
    ].join(' ');

    this.out.write(this.clear + prompt);
    this.out.write(cursor.move(-this.rendered.length + this.cursor*this.scale));

    this.clear = clear(prompt);
  }
}

module.exports = TextPrompt;
