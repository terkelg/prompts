'use strict';

const util = require('util');
const prompts = require('./prompts');

const passOn = ['suggest', 'format', 'onState', 'validate'];
const noop = () => {};
const messages = {
  errorInvalid: 'Please enter a valid value',
  hintMultiselect: '- Space to select. Return to submit.',
  hintSelect: '- Use arrow-keys. Return to submit.',
  messageRequired: 'Prompt message is required',
  no: 'no',
  noPrimaryOption: '(y/N)',
  noMatchesFound: 'No matches found',
  typeUndefined: 'Prompt type (%s) is not defined',
  yes: 'yes',
  yesPrimaryOption: '(Y/n)',
};

/**
 * Prompt for a series of questions
 * @param {Array|Object} questions Single question object or Array of question objects
 * @returns {Object} Object with values from user input
 */
async function prompt(questions=[], { onSubmit=noop, onCancel=noop }={}) {
  const answers = {};
  questions = [].concat(questions);
  let answer, question, quit, name, type;
  let MAP = prompt._map || {};

  for (question of questions) {
    ({ name, type } = question);

    if (MAP[name] !== void 0) {
      answers[name] = MAP[name];
      delete MAP[name];
      continue; // take val & run
    }

    // if property is a function, invoke it unless it's a special function
    for (let key in question) {
      if (passOn.includes(key)) continue;
      let value = question[key];
      question[key] = typeof value === 'function' ? await value(answer, { ...answers }, question) : value;
    }

    if (typeof question.message !== 'string') {
      throw new Error(messages.messageRequired);
    }

    // update vars in case they changed
    ({ name, type } = question);

    // skip if type is a falsy value
    if (!type) continue;

    if (prompts[type] === void 0) {
      throw new Error(util.format(messages.typeUndefined, type));
    }

    // pass translated messages
    question.messages = messages;

    try {
      answer = await prompts[type](question);
      answers[name] = answer = question.format ? await question.format(answer, answers) : answer;
      quit = await onSubmit(question, answer, answers);
    } catch (err) {
      quit = !(await onCancel(question, answers));
    }

    if (quit) return answers;
  }

  return answers;
}

function inject(obj) {
  prompt._map = prompt._map || {};
  for (let k in obj) {
    prompt._map[k] = obj[k];
  }
}

function translate(customMessages) {
  Object.assign(messages, customMessages);
}

module.exports = Object.assign(prompt, { prompt, prompts, inject, translate });
