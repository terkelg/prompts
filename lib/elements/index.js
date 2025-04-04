'use strict';

module.exports = {
  TextPrompt: require('./text'),
  SelectPrompt: require('./select'),
  TogglePrompt: require('./toggle'),
  DatePrompt: require('./date'),
  NumberPrompt: require('./number'),
  CodeNumberPrompt: require('./codeNumber'),
  MultiselectPrompt: require('./multiselect'),
  AutocompletePrompt: require('./autocomplete'),
  AutocompleteMultiselectPrompt: require('./autocompleteMultiselect'),
  ConfirmPrompt: require('./confirm')
};
