'use strict';

const readline = require('readline');
const { action } = require('../util');
const EventEmitter = require('events');
const { beep, cursor } = require('sisteransi');
const color = require('kleur');
const MuteStream = require('mute-stream');

/**
 * Base prompt skeleton
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class Prompt extends EventEmitter {
  constructor(opts={}) {
    super();

    this.firstRender = true;
    this.in = opts.stdin || process.stdin;
    if (opts.type === 'text') {
      const ms = new MuteStream();
      ms.pipe(opts.stdout || process.stdout);
      this.out = ms;
      this.rl = readline.createInterface({
        input:this.in,
        output: this.out,
        escapeCodeTimeout:50,
        terminal: true
      });
    } else {
      this.out = opts.stdout || process.stdout;
      this.rl = readline.createInterface({
        input:this.in,
        escapeCodeTimeout:50,
      });
    }
    this.onRender = (opts.onRender || (() => void 0)).bind(this);
    readline.emitKeypressEvents(this.in, this.rl);

    if (this.in.isTTY) this.in.setRawMode(true);
    const isSelect = [ 'SelectPrompt', 'MultiselectPrompt' ].indexOf(this.constructor.name) > -1;
    const keypress = (str, key) => {
      let a = action(key, isSelect);
      if (opts.type !== 'text') {
        if (a === false) {
          this._ && this._(str, key);
        } else if (typeof this[a] === 'function') {
          this[a](key);
        } else {
          this.bell();
        }
      } else {
        if (a === 'abort' || a === 'exit') {
          this[a](key);
        } else {
          this._ && this._(str, key);
        }
      }
    };

    this.close = () => {
      this.out.write(cursor.show);
      this.in.removeListener('keypress', keypress);
      if (this.in.isTTY) this.in.setRawMode(false);
      this.rl.close();
      this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this.value);
      this.closed = true;
    };

    this.in.on('keypress', keypress);
  }

  fire() {
    this.emit('state', {
      value: this.value,
      aborted: !!this.aborted,
      exited: !!this.exited
    });
  }

  bell() {
    this.out.write(beep);
  }

  render() {
    this.onRender(color);
    if (this.firstRender) this.firstRender = false;
  }
}

module.exports = Prompt;
