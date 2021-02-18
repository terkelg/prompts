const color = require('kleur');
const Prompt = require('./prompt');
const { erase, cursor } = require('sisteransi');
const { style, clear, lines, figures } = require('../util');
const stringWidth = require('string-width');
const stripAnsi = require('strip-ansi');

function last(array) {
  const length = array == null ? 0 : array.length
  return length ? array[length - 1] : undefined
}

function lastLine(content) {
  return last(content.split('\n'));
}

/**
 * TextPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style='default'] Render style
 * @param {String} [opts.initial] Default value
 * @param {Function} [opts.validate] Validate function
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.error] The invalid error label
 */
class TextPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.transform = style.render(opts.style);
    this.scale = this.transform.scale;
    this.msg = opts.message;
    this.initial = opts.initial || ``;
    this.validator = opts.validate || (() => true);
    this.value = ``;
    this.errorMsg = opts.error || `Please Enter A Valid Value`;
    this.cursor = Number(!!this.initial);
    this.clear = clear(``, this.out.columns);
    this.rl.on('line', input => this.submit(input));
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.value = this.initial || this.rl.line;
    this.done = this.aborted = true;
    this.error = false;
    this.red = false;
    this.fire();
    this.render(this.value);
    this.rl.setPrompt('');
    this.rl.output.unmute();
    this.out.write('\n');
    this.close();
  }

  async validate() {
    let valid = await this.validator(this.value);
    if (typeof valid === `string`) {
      this.errorMsg = valid;
      valid = false;
    }
    this.error = !valid;
  }

  async submit(value) {
    this.value = value || this.initial;
    await this.validate();
    if (this.error) {
      this.red = true;
      this.fire();
      this.render();
      return;
    }
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render(this.value);
    this.rl.setPrompt('');
    this.rl.output.unmute();
    this.out.write('\n');
    this.close();
  }

  _() {
    if (this.initial) {
      this.initial = undefined;
    }
    this.render();
  }

  left(x) {
    this.rl.output.write(cursor.backward(x));
  }

  right(x) {
    this.rl.output.write(cursor.forward(x));
  }

  render(value) {
    this.rl.output.unmute();
    if (this.closed) return;

    let content = this.msg;
    if (!this.firstRender) {
      if (this.outputError)
        this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
      if (!this.initial) content = this.msg;
      this.out.write(clear(this.outputText, this.out.columns));
    } else {
      content = `${this.msg}${color.gray(this.initial)}`;
      value = this.initial;
    }

    super.render();
    this.outputError = '';
    this.rendered = this.transform.render(this.done? value: this.rl.line);

    const message = [
      style.symbol(this.done, this.aborted),
      content,
      style.delimiter(this.done)
    ];
    this.outputText = message.concat(this.red ? color.red(this.rendered) : this.rendered).join(' ');

    if (this.error) {
      this.outputError += this.errorMsg.split(`\n`)
        .reduce((a, l, i) => a + `\n${i ? ' ' : figures.pointerSmall} ${color.red().italic(l)}`, ``);
    }

    let prompt = stripAnsi(this.outputText);
    if (this.rl.line.length) {
      prompt = prompt.slice(0, -this.rl.line.length);
    }
    this.rl.setPrompt(prompt);

    this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);

    this.left(stringWidth(lastLine(this.outputText)));

    const cursorPos = this.rl.getCursorPos();
    if (cursorPos.cols > 0) {
      this.right(cursorPos.cols);
    }

    this.rl.output.mute();
  }
}

module.exports = TextPrompt;
