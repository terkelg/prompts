'use strict';

const color          = require('kleur');
const Prompt                    = require('./prompt');
const { style, clear, figures, strip } = require('../util');
const { erase, cursor }         = require('sisteransi');

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
};

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
    this.errorMsg = opts.error || 'Please Enter A Valid Value';
    this.validator = opts.validate || (() => true);
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
    this.error = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }
  
  async validate() {
    let valid = await this.validator(this.value);
    if (typeof valid === 'string') {
      this.errorMsg = valid;
      valid = false;
    }
    this.error = !valid;
  }

  async submit() {
    await this.validate();
    if (this.error) {
      this.color = 'red';
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
    let clear = erase.line + (this.lines ? erase.down(this.lines) : '') + cursor.to(0);
    this.lines = 0;
    
    let error = '';
    if (this.error) {
      let lines = this.errorMsg.split('\n');
      error = lines.reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
      this.lines = lines.length;
    }

    // Print prompt
    let prompt = [
        style.symbol(this.done, this.aborted),
        color.bold(this.msg),
        style.delimiter(false),
        this.date
            .map((v, i) => {
              if (i === 1) v += 1;
              v = `${v}`.padStart(2, '0');
              return this.done || this.cursor !== i ? v : color.cyan().underline(v);
            })
            .join('/')
      ].join(' ');
    
    let position = '';
    if (this.lines) {
        position += cursor.up(this.lines);
        position += cursor.left+cursor.to(strip(prompt).length);
    }

    this.out.write(clear+prompt+error+position);
    // if (!this.done) {
      // Date select
      // this.out.write(
      //     this.date
      //       .map((v, i) => {
      //         if (i === 1) v += 1;
      //         v = `${v}`.padStart(2, '0');
      //         return this.cursor === i ? color.cyan().underline(v) : v;
      //       })
      //       .join('/')
      // );
    // }
  }
}

module.exports = DatePrompt;
