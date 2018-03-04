const color = require('clorox');
const Prompt = require('./prompt');
const { cursor, erase } = require('sisteransi');
const { style: stl, clear } = require('../util');

const isNumber = /[0-9]/;
const isDef = any => any !== undefined;
const isNull = any => any === null;

class NumberPrompt extends Prompt {
  constructor({ message, initial = '', min, max, style = 'default' }) {
    super();

    this.msg = message;
    this.transform = stl.render(style);

    this.min = isDef(min) ? min : -Infinity;
    this.max = isDef(max) ? max : Infinity;
    this.value = initial;

    this.typed = '';
    this.lastHit = 0;

    this.initialValue = this.value;

    this.render();
  }

  reset() {
    this.typed = '';
    this.value = this.initialValue;
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
    let value = this.transform.render(this.value !== null ? this.value : '');
    if (!this.done) value = color.cyan.underline(value);

    this.out.write(
      erase.line +
        cursor.to(0) +
        [
          stl.symbol(this.done, this.aborted),
          color.bold(this.msg),
          stl.delimiter(this.done),
          value
        ].join(' ')
    );
  }
}

module.exports = NumberPrompt;
