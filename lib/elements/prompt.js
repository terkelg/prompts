'use strict';

const readline = require('readline');
const { action } = require('../util');
const EventEmitter = require('events');
const { beep, cursor } = require('sisteransi');
const color = require('kleur');

/**
 * Base prompt skeleton
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {Boolean} [opts.removeInputListenerManually] only removeInputListener() close the stdin listener. This option fixing the keypress event lost between close and reopen the input listener
 */
class Prompt extends EventEmitter {
  constructor(opts = {}) {
    super();

    this.firstRender = true;
    global._prompt = !!global._prompt ? global._prompt : { listener: [] };
    this.removeInputListenerManually = opts.removeInputListenerManually || false;
    this.in = opts.stdin || process.stdin;
    this.out = opts.stdout || process.stdout;
    this.onRender = (opts.onRender || (() => void 0)).bind(this);

    if (!this.removeInputListenerManually || !global._prompt.listening) {
      global._prompt.rl = readline.createInterface({ input: this.in, escapeCodeTimeout: 50 });
      readline.emitKeypressEvents(this.in, global._prompt.rl);
      if (this.in.isTTY) this.in.setRawMode(true);
      global._prompt.in = this.in;
      global._prompt.kill = () => {
        global._prompt.in.removeListener('keypress', keypress);
        if (global._prompt.in.isTTY) global._prompt.in.setRawMode(false);
        global._prompt.rl.close();
        global._prompt.listening = false;
      }
    }

    this._isSelect = ['SelectPrompt', 'MultiselectPrompt'].indexOf(this.constructor.name) > -1;
    const keypress = (str, key) => {
      if (global._prompt.listener.length) {
        const __this = global._prompt.listener[0];
        let a = action(key, __this._isSelect);
        if (a === false) {
          __this._ && __this._(str, key);
        } else if (typeof __this[a] === 'function') {
          __this[a](key);
        } else {
          __this.bell();
        }
      }
    };

    this.close = () => {
      this.out.write(cursor.show);
      global._prompt.listener.pop();
      if (!this.removeInputListenerManually || !global._prompt.listening) {
        global._prompt.kill();
      }
      this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this.value);
      this.closed = true;
    };

    if (!this.removeInputListenerManually || !global._prompt.listening) {
      this.in.on('keypress', keypress);
    }
    global._prompt.listener.push(this);
    global._prompt.listening = this.removeInputListenerManually ? true : false;
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
