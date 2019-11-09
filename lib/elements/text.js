const color = require('kleur');
const Prompt = require('./prompt');
const { erase, cursor } = require('sisteransi');
const { style, clear, lines, figures } = require('../util');

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
    this.hint = opts.hint || ``;
    this.validator = opts.validate || (() => true);
    this.value = ``;
    this.errorMsg = opts.error || `Please Enter A Valid Value`;
    this.cursor = 0;
    this.clear = clear(``);
    this.render();
  }

  set value(v) {
    if (!v && this.initial) {
      this.placeholder = true;
      this.rendered = color.gray(this.transform.render(this.initial));
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
    this.value = ``;
    this.cursor = 0;
    this.fire();
    this.render();
  }

  abort() {
    this.value = this.value || this.initial;
    this.done = this.aborted = true;
    this.error = false;
    this.red = false;
    this.fire();
    this.render();
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

  async submit() {
    this.value = this.value || this.initial;
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
    this.render();
    this.out.write('\n');
    this.close();
  }

  next() {
    if (!this.placeholder) return this.bell();
    this.value = this.initial;
    this.cursor = this.rendered.length;
    this.fire();
    this.render();
  }

  moveCursor(n) {
    if (this.placeholder) return;
    this.cursor = this.cursor+n;
  }

  _(c, key) {
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${c}${s2}`;
    this.red = false;
    this.cursor = this.placeholder ? 0 : s1.length+1;
    this.render();
  }

  delete() {
    if (this.cursor === 0) return this.bell();
    let s1 = this.value.slice(0, this.cursor-1);
    let s2 = this.value.slice(this.cursor);
    this.moveCursor(-1);
    this.value = `${s1}${s2}`;
    this.red = false;
    this.render();
  }

  deleteForward() {
    if(this.cursor*this.scale >= this.rendered.length || this.placeholder) return this.bell();
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor+1);
    this.value = `${s1}${s2}`;
    this.red = false;
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
    if (this.closed) return;
    if (this.firstRender) {
      this.out.write('\n' + cursor.up(1));
      this.prevRowCount = 0;
    }
    super.render();
    let outputPostMessage = ``;
    this.postMessage = ``;

    this.outputPrompt = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(this.done),
      ``
    ].join(` `);
    this.outputText = this.red ? color.red(this.rendered) : this.rendered;

    const outputLength = (
      /* symbol length */
      2 +
      /* prompt */
      this.msg.length +
      /* delimiter */
      3 +
      /* input */
      this.value.length
    )

    const rowCount = lines(` `.repeat(outputLength)) - 1;
    const curRowLength = outputLength - (this.out.columns * rowCount);
    const cursorGrossPos = this.cursor - this.value.length + outputLength;
    const cursorRowCnt = lines(` `.repeat(cursorGrossPos)) - 1;
    const cursorHorzPos = cursorGrossPos - (this.out.columns * cursorRowCnt);
    const cursorRowOffset = rowCount - cursorRowCnt;

    if (this.error || this.hint) {
      this.postMessage = this.error ? this.errorMsg : this.hint;
      outputPostMessage = this.postMessage.split(`\n`)
        .map((l, i) => `${i > 0 ? ' ' : figures.pointerSmall} ${this.error ? color.red().italic(l) : color.gray().italic(l)}` + erase.lineEnd)
        .join(`\n`);
      if (this.hint) this.error = false;
    }

    const postMessageRowCount = lines(this.postMessage);

    this.out.write(
      (this.prevRowCount > 0 ? cursor.up(this.prevRowCount) : ``) +
      cursor.to(0) +
      this.outputPrompt +
      (this.placeholder ? cursor.save : ``) +
      this.outputText +
      (!this.placeholder ? cursor.save : ``) +
      (curRowLength !== this.out.columns ? erase.lineEnd : ``) +
      (this.postMessage ?
        `\n${outputPostMessage}` +
        erase.down() +
        cursor.up(postMessageRowCount + cursorRowOffset) :
          ``
      ) +
      cursor.to(cursorHorzPos)
      // cursor.restore
    );
    this.prevRowCount = rowCount;
  }
}

module.exports = TextPrompt;
