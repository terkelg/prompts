const color = require('kleur');
const Prompt = require('./prompt');
const { cursor } = require('sisteransi');
const { style, clear, strip, figures } = require('../util');

/**
 * MessagePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style='default'] Render style
 * @param {String} [opts.initial] Default value
 * @param {Function} [opts.validate] Validate function
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.error] The invalid error label
 */
class MessagePrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.transform = style.render(opts.style);
    this.scale = this.transform.scale;
    this.msg = opts.message;
    this.cursor = Number(!!this.initial);
    this.clear = clear(``);
    this.aborted = false;
    this.render();
    this.close();
  }

  render() {
    if (this.closed) return;
    super.render();

    const prompt = `  ${color.bold(this.msg)}`;
    const position = cursor.move(-prompt.length + this.cursor * this.scale);

    this.out.write(this.clear + prompt + position);
    this.clear = clear(prompt);
    this.out.write('\n');

    // Exiting the call stack to make sure the caller is set up when we fire the close event
    setTimeout(() => this.close());
  }
}

module.exports = MessagePrompt;
