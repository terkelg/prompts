const color = require('clorox');
const Prompt = require('./prompt');
const { cursor } = require('sisteransi');
const { style, clear } = require('../util');

class TextPrompt extends Prompt {
  constructor(opts={}) {
    super();

    opts.initial = 'hello world';

    this.transform = style.render(opts.style || 'default');
    this.scale = this.transform.scale;

    this.msg = opts.message;
    this.initialValue = opts.initial;

    this.value = '';
    this.cursor = this.rendered.length;

    this.clear = clear('');
    this.render();
  }

  set value(v) {
    this._value = v;
    if (v) {
      this.rendered = this.transform.render(v)
    } else {
      this.rendered = color.gray(this.initialValue);
    }
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
    if (this.value) this.cursor++;
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
    this.cursor = this.value.length;
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
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(this.done),
      this.rendered
    ].join(' ');

    this.out.write(this.clear + prompt);
    this.out.write(cursor.move(-this.rendered.length + this.cursor*this.scale));

    this.clear = clear(prompt);
  }
}

module.exports = TextPrompt;
