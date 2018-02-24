const color = require('clorox');
const Prompt = require('./prompt');
const { style, clear } = require('../util');
const { erase, cursor } = require('sisteransi');

/**
 * A CLI classic confirm prompt
 */
class ConfirmPrompt extends Prompt {
  constructor({ message, initial = false }) {
    super();
    this.msg = message;
    this.value = initial;
    this.initialValue = initial;
    this.render(true);
  }

  reset() {
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

  _(c, key) {
    if (c.toLowerCase() === 'y') {
      this.value = true;
      return this.submit();
    }
    if (c.toLowerCase() === 'n') {
      this.value = false;
      return this.submit();
    }
    return this.bell();
  }

  render(first) {
    if (first) this.out.write(cursor.hide);
    this.out.write(
      erase.line +
        cursor.to(0) +
        [
          style.symbol(this.done, this.aborted),
          color.bold(this.msg),
          style.delimiter(this.done),
          this.done
            ? this.value ? 'yes' : 'no'
            : color.gray(this.initialValue ? '(Y/n)' : '(y/N)')
        ].join(' ')
    );
  }
}

module.exports = ConfirmPrompt;
