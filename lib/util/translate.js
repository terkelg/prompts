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

function translate(key) {
  return messages[key];
}

translate.localize = customMessages => {
  Object.assign(messages, customMessages);
};

module.exports = translate;
