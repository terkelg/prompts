const color = require('clorox');
const Prompt = require('./prompt');
const { cursor, erase } = require('sisteransi');
const { style: stl, clear } = require('../util');

const isNumber = /[0-9]/;
const isDef = any => any !== undefined;
const isNull = any => any === null;

// initial, min, max, style, message
class NumberPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);

    opts.initial = 123;

    this.transform = stl.render(opts.style);
    this.scale = this.transform.scale;

    this.msg = opts.message;
    this.initial = opts.initial || '';

    this.min = isDef(opts.min) ? opts.min : -Infinity;
    this.max = isDef(opts.max) ? opts.max : Infinity;
    this.value = ''

    this.typed = '';
    this.lastHit = 0;

    this.render();
  }

  set value(v) {
    if (!v && v !== 0 && this.initial) {
      this.placeholder = true;
      this.rendered = color.gray(this.initial);
    } else {
      this.placeholder = false;
      this.rendered = this.transform.render(v);
    }
    this._value = v;
    this.fire();
  }

  get value() {
    return this._value;
  }

  reset() {
    this.typed = '';
    this.value = '';
    this.fire();
    this.render();
  }

  abort() {
    this.value = this.value || this.initial;
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.value = this.value || this.initial;
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  up() {
    this.typed = '';
    if (this.value >= this.max) return this.bell();
    this.value++;
    this.fire();
    this.render();
  }

  down() {
    this.typed = '';
    if (this.value <= this.min) return this.bell();
    this.value--;
    this.fire();
    this.render();
  }

  delete() {
    let val = this.value.toString();
    if (val.length === 0) return this.bell();
    this.value = parseInt((val = val.slice(0, -1))) || '';
    this.fire();
    this.render();
  }

  _(c, key) {
    if (!isNumber.test(c)) return this.bell();

    const now = Date.now();
    if (now - this.lastHit > 1000) this.typed = ''; // 1s elapsed
    this.typed += c;
    this.lastHit = now;

    this.value = Math.min(parseInt(this.typed), this.max);
    if (this.value > this.max) this.value = this.max;
    if (this.value < this.min) this.value = this.min;
    this.fire();
    this.render();
  }

  render() {
    let underline = !this.done || !this.placeholder;
    this.out.write(
      erase.line +
        cursor.to(0) +
        [
          stl.symbol(this.done, this.aborted),
          color.bold(this.msg),
          stl.delimiter(this.done),
          underline ? color.cyan.underline(this.rendered) : this.render
        ].join(' ')
    );
  }
}

module.exports = NumberPrompt;
