'use strict';

const types = require('./prompts');
const ignore = ['suggest', 'format'];
const toArray = val => (Array.isArray(val) ? val : val == null ? [] : [val]);
const noop = () => {};

/**
 * Prompt for a series of questions
 * @param {Array|Object} questions Single question object or Array of question objects
 * @returns {Object} Object with values from user input
 */
async function prompts(questions = [], { onSubmit = noop, onCancel = noop } = {}) {
  const prompts = toArray(questions);
  const answers = {};
  let answer, quit;

  for (const prompt of prompts) {
    // if property is a function, invoke it unless it's ignored
    for (let key in prompt) {
      if (ignore.includes(key)) continue;
      let value = prompt[key];
      prompt[key] = typeof value === 'function' ? await value(answer, { ...answers }, prompt) : value;
    }

    // skip questins of type null
    if (prompt.type === null) continue;

    if (!types.hasOwnProperty(prompt.type)) {
      throw new Error(`prompt type ${prompt.type} not defined`);
    }

    try {
      answer = await types[prompt.type](prompt);
      answers[prompt.name] = prompt.format ? await prompt.format(answer, { ...answers }) : answer;
      quit = onSubmit(prompt, answer);
    } catch (err) {
      quit = onCancel(prompt);
    }

    if (quit) return answers;
  }

  return answers;
}

module.exports = prompts;
