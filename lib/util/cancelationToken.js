'use strict';

const EventEmitter = require('events');

class CancelationToken extends EventEmitter {
  constructor() {
    super();
    this._canceled = false;
  }

  get canceled() {
    return this._canceled;
  }

  cancel() {
    if (!this._canceled) {
      this._canceled = true;
      this.emit('canceled');
    }
  }
}

module.exports = CancelationToken;
