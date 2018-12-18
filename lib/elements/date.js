'use strict';

const color = require('kleur');
const Prompt = require('./prompt');
const { style, clear, figures } = require('../util');
const { erase, cursor } = require('sisteransi');

const dateActions = {
  getters: [
    'getDate',
    'getMonth',
    'getFullYear'
  ],
  setters: [
    'setDate',
    'setMonth',
    'setFullYear'
  ]
}

/**
 * DatePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Number} [opts.initial] Index of default value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class DatePrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = 0;
    this._date = opts.initial || new Date();
    this.date = [
      this._date.getDate(),
      this._date.getMonth(),
      this._date.getFullYear()
    ];
    this.clear = clear('');
    this.render();
  }

  get value() {
    return new Date(this.date[2], this.date[1], this.date[0] + 1);
  }

  moveCursor(n) {
    this.cursor = n;
    this.fire();
  }

  reset() {
    this.moveCursor(0);
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

  changeDate(val) {
    const currentAction = dateActions.setters[this.cursor];
    this._date[currentAction](this.date[this.cursor] + val);
    this.date = dateActions.getters.map(ac => this._date[ac]());
  }

  up() {
    this.changeDate(1);
    this.render();
  }

  down() {
    this.changeDate(-1);
    this.render();
  }

  left() {
    if (this.cursor === 0) return this.bell();
    this.moveCursor(this.cursor - 1);
    this.render();
  }

  right() {
    if (this.cursor === 2) return this.bell();
    this.moveCursor(this.cursor + 1);
    this.render();
  }

  render() {
    if (this.closed) return;
    if (this.first) this.out.write(cursor.hide);
    else this.out.write(erase.lines(1));
    super.render();

    // Print prompt
    this.out.write([
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(false),
        this.done && this.date
            .map((v, i) => {
              if (i === 1) v += 1;
              v = `${v}`.padStart(2, '0');
              return v;
            })
            .join('/')
      ].join(' '));

    // Date select
    if (!this.done) {
      this.out.write(
          this.date
            .map((v, i) => {
              if (i === 1) v += 1;
              v = `${v}`.padStart(2, '0');
              return this.cursor === i ? color.cyan().underline(v) : v;
            })
            .join('/')
      );
    }
  }
}

module.exports = DatePrompt;
