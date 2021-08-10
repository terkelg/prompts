'use strict';

const MultiselectPrompt = require('./multiselect');
const { figures } = require('../util');
/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class CountableMultiselectPrompt extends MultiselectPrompt {
  constructor(opts={}) {
    opts.overrideRender = true;
    super(opts);

    for (const item of this.value) {
      item.count = 0;
    }

    this.render();
  }

  updateCount(increment) {
    const item = this.value[this.cursor];
    item.count = Math.max(0, item.count + increment);
    item.selected = item.count > 0;
    this.render();
  }

  left() {
    this.updateCount(-1);
  }

  right() {
    this.updateCount(1);
  }

  renderInstructions() {
    const text = super.renderInstructions();
    return text.replace('Toggle selection', 'Increment/decrement value').replace('    a: Toggle all\n', '');
  }

  renderOption(cursor, v, i, arrowIndicator) {
    const text = super.renderOption(cursor, v, i, arrowIndicator);
    return text.replace(figures.radioOn, v.count).replace(figures.radioOff, v.count);
  }

  _() {
    // Do nothing.
  }
}

module.exports = CountableMultiselectPrompt;
