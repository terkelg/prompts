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

    opts.initial = '123';

    this.transform = style.render(opts.style || 'default');
    this.scale = this.transform.scale;

    this.msg = opts.message;
    this.initial = opts.initial;

    this.value = '';
    this.cursor = this.rendered.length;

    this.clear = clear('');
    this.render();
  }

  set value(v) {
    if (!v && this.initial) {
      this.placeholder = true;
      this.rendered = color.gray(this.transform.render(this.initial))
    } else {
      this.placeholder = false;
      this.rendered = this.transform.render(v);
    }
    this._value = v; // make sure to return placeholder
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

  moveCursor(n) {
    this.cursor = this.placeholder ? this.cursor : this.cursor+n;
  }

  _(c, key) {
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor);
    this.moveCursor(1);
    this.value = `${s1}${c}${s2}`;
    if (this.placeholder) this.cursor = 0;
    this.render();
  }

  delete() {
    if (this.value.length === 0) return this.bell();
    let s1 = this.value.slice(0, this.cursor-1);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${s2}`;
    this.moveCursor(-1);
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
    if (this.cursor <= 0 || this.placeholder) return this.bell();
    this.moveCursor(-1);
    this.render();
  }

  right() {
    if (this.cursor*this.scale >= this.rendered.length || this.placeholder) return this.bell();
    this.moveCursor(1);
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

    let position;
    if (this.placeholder) {
      position = -this.initial.length*this.scale;
    } else {
      position = -this.rendered.length;
      position += this.cursor*this.scale;
    }
    this.out.write(cursor.move(position))

    this.clear = clear(prompt);
  }
}

module.exports = TextPrompt;
