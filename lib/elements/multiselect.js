'use strict';

const color = require('kleur');
const { cursor } = require('sisteransi');
const figures = require('figures');
const Prompt = require('./prompt');
const { clear, style } = require('../util');

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
class MultiselectPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = opts.cursor || 0;
    this.scrollIndex = opts.cursor || 0;
    this.hint = opts.hint || '';
    this.warn = opts.warn || '- This option is disabled -';
    this.maxChoices = opts.max;
    this.inputValue = '';
    this.value = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string')
        ch = {title: ch, value: idx};
      return {
        title: ch && (ch.title || ch.value || ch),
        value: ch && (ch.value || idx),
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.filteredOptions = this.value;
    this.clear = clear('');
    this.render();
  }

  reset() {
    this.value.map(v => !v.selected);
    this.cursor = 0;
    this.fire();
    this.render();
  }

  selected() {
    return this.value.filter(v => v.selected);
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

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.filteredOptions.length - 1;
    this.render();
  }
  next() {
    this.cursor = (this.cursor + 1) % this.filteredOptions.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.filteredOptions.length - 1;
    } else {
      this.cursor--;
    }
    this.render();
  }

  down() {
    if (this.cursor === this.filteredOptions.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor++;
    }
    this.render();
  }

  left() {
    this.filteredOptions[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.filteredOptions[this.cursor].selected = true;
    this.render();
  }

  delete() {
    if (this.inputValue.length) {
      this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
      this.updateFilteredOptions();
    }
  }

  updateFilteredOptions() {
    const currentHighlight = this.filteredOptions[this.cursor];
    this.filteredOptions = this.value
      .filter(v => {
        if (this.inputValue) {
          return v.title.includes(this.inputValue) || v.value.includes(this.inputValue);
        }
        return true;
      });
    const newHighlightIndex = this.filteredOptions.findIndex(v => v === currentHighlight)
    this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
    this.render();
  }

  handleSpaceToggle() {
    const v = this.filteredOptions[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  handleInputChange(c) {
    this.inputValue = this.inputValue + c;
    this.updateFilteredOptions();
  }

  _(c, key) {
    if (c === ' ') {
      this.handleSpaceToggle();
    } else {
      this.handleInputChange(c);
    } 
  }

  renderInstructions() {
    return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
    `
  }

  renderCurrentInput() {
    return `
Filtered resultes for: ${this.inputValue ? this.inputValue : color.gray('Enter something to filter')}\n`;
  }

  renderOption(cursor, v, i) {
    let title;
    if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
    else title = cursor === i ? color.cyan().underline(v.title) : v.title;
    return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + '  ' + title
  }

  paginateOptions() {
    const c = this.cursor;
    let styledOptions = this.filteredOptions.map((v, i) => this.renderOption(c, v, i));
    const numOfOptionsToRender = 10; // if needed, can add an option to change this.

    let scopedOptions = styledOptions;
    if (styledOptions.length === 0) {
      return color.red('No matches for this query.');
    } else if (styledOptions.length > numOfOptionsToRender) {
      let startIndex = c - (numOfOptionsToRender / 2);
      let endIndex = c + (numOfOptionsToRender / 2);
      if (startIndex < 0) {
        startIndex = 0;
        endIndex = numOfOptionsToRender;
      } else if (endIndex > this.filteredOptions.length) {
        endIndex = this.filteredOptions.length;
        startIndex = endIndex - numOfOptionsToRender;
      }
      scopedOptions = styledOptions.slice(startIndex, endIndex);
    }
    return '\n' + scopedOptions.join('\n') + '\n' + color.dim('(Move up and down to reveal more choices)');
  }

  renderOptions() {
    if (!this.done) {
      return this.paginateOptions();
    }
    return '';
  }

  renderDoneOrInstructions() {
    if (this.done) {
      const selected = this.value
        .filter(e => e.selected)
        .map(v => v.title)
        .join(', ');
      return selected;
    }
    
    const output = [color.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];

    if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
      output.push(color.yellow(this.warn));
    }
    return output.join(' ');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    super.render();

    // print prompt
    
    let prompt = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(false),
      this.renderDoneOrInstructions()
    ].join(' ');
    
    prompt += this.renderOptions();

    this.out.write(this.clear + prompt);
    this.clear = clear(prompt);
  }
}

module.exports = MultiselectPrompt;
