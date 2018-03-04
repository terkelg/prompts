const color = require('clorox');
const Prompt = require('./prompt');
const { cursor } = require('sisteransi');
const { style: stl, clear } = require('../util');

// take args.symbols object. Merge with internal
// -- if function give access to color

class TextPrompt extends Prompt {
  constructor({ message, cursor, initial, style = 'default' }) {
    super();

    this.msg = message;
    this.value = initial || '';

    this.initialValue = this.value;
    this.transform = stl.render(style);

    this.rendered = this.transform.render(this.value);
    this.cursor = cursor || this.rendered.length;
    this.index = this.cursor;

    this.clear = clear('');
    this.render(true);
  }

  setValue(v) {
    this.value = v;
    this.rendered = this.transform.render(v);
    this.cursor = Math.min(this.rendered.length, this.cursor);
    this.fire();
  }

  reset() {
    this.setValue(this.initialValue);
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
    let p1 = this.value.slice(0, this.index);
    let p2 = this.value.slice(this.index);

    this.cursor += this.transform.inc;
    this.index++;
    this.setValue(`${p1}${c}${p2}`);
    console.log('\n', `${p1}-${c}-${p2}`);
    //this.setValue(this.value + c);
    //this.cursor = this.rendered.length;
    this.render();
  }

  delete() {
    if (this.value.length === 0) return this.bell();
    this.cursor -= this.transform.inc;
    this.index--;
    let p1 = this.value.slice(0, this.index);
    let p2 = this.value.slice(this.index+1);
    this.setValue(`${p1}${p2}`);
    console.log('\n', `${p1}-${p2}`);
    this.render();
  }

  first() {
    this.cursor = this.index = 0;
    this.render();
  }

  last() {
    this.cursor = this.rendered.length;
    this.index = this.value.length;
    this.render();
  }

  left() {
    if (this.cursor <= 0) return this.bell();
    this.cursor -= this.transform.inc;
    this.index--;
    this.render();
  }

  right() {
    if (this.cursor >= this.rendered.length) return this.bell();
    this.cursor += this.transform.inc;
    this.index++;
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
    this.out.write(cursor.move(-this.rendered.length + this.cursor));

    this.clear = clear(prompt);
  }
}

module.exports = TextPrompt;
