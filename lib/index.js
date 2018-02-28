'use strict';

const prompts = require('./prompts');

const toArray = val => (Array.isArray(val) ? val : val == null ? [] : [val]);
const ignore = ['suggest', 'format'];
const noop = () => {};

/**
 * Prompt for a series of questions
 * @param {Array|Object} questions Single question object or Array of question objects
 * @returns {Object} Object with values from user input
 */
async function prompt(questions=[], { onSubmit=noop, onCancel=noop }={}) {
  const answers = {};
  questions = toArray(questions);
  let answer, question, quit, name, key;
  let MAP = prompt._map || {};

  for (question of questions) {
    name = question.name;

    if (MAP[name] !== void 0) {
      answers[name] = MAP[name];
      delete MAP[name];
      continue; // take val & run
    }

    // if property is a function, invoke it unless it's ignored
    for (key in question) {
      if (ignore.includes(key)) continue;
      let value = question[key];
      question[key] = typeof value === 'function' ? await value(answer, { ...answers }, question) : value;
    }

    // skip if type is a falsy value
    if (!question.type) continue;

    if (!prompts.hasOwnProperty(question.type)) {
      throw new Error(`prompt type ${question.type} not defined`);
    }

    try {
      answer = await prompts[question.type](question);
      answers[name] = answer = question.format ? question.format(answer, answers) : answer;
      quit = onSubmit(question, answer);
    } catch (err) {
      quit = onCancel(question);
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

module.exports = Object.assign(prompt, { prompt, prompts, inject });
