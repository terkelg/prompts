const color = require('clorox');
const Prompt = require('./prompt');
const { cursor } = require('sisteransi');
const { style, clear } = require('../util');

/**
 * TextPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style] Render style
 * @param {String} [opts.initial] Default value
 */
class TextPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);

    opts.initial = 'hello world';

    this.transform = style.render(opts.style || 'default');
    this.scale = this.transform.scale;

    this.msg = opts.message;
    this.initialValue = opts.initial;
    this.initialState = !!opts.initial;

    this.value = '';
    this.cursor = this.rendered.length;

    this.clear = clear('');
    this.render();
  }

  set value(v) {
    if (v) {
      this.initialState = false;
      this.rendered = this.transform.render(v);
    } else {
      this.initialState = true;
      this.rendered = color.gray(this.transform.render(this.initialValue));
    }
    this._value = v;
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

  incCursor(n) {
    this.cursor = this.initialState ? this.cursor : this.cursor;
  }

  _(c, key) {
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor);
    this.incCursor(1);
    this.value = `${s1}${c}${s2}`;
    this.render();
  }

  delete() {
    if (this.value.length === 0) return this.bell();
    let s1 = this.value.slice(0, this.cursor-1);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${s2}`;
    this.incCursor(-1);
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
    if (this.cursor <= 0 || this.initialState) return this.bell();
    this.incCursor(-1);
    this.render();
  }

  right() {
    if (this.cursor*this.scale >= this.rendered.length || this.initialState) return this.bell();
    this.incCursor(1);
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
