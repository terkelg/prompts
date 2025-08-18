'use strict';

module.exports = {
  TextPrompt: require('./text'),
  SelectPrompt: require('./select'),
  TogglePrompt: require('./toggle'),
  DatePrompt: require('./date'),
  NumberPrompt: require('./number'),
  MultiselectPrompt: require('./multiselect'),
  AutocompletePrompt: require('./autocomplete'),
  AsyncAutocompletePrompt: require('./asyncAutocomplete'),
  AutocompleteMultiselectPrompt: require('./autocompleteMultiselect'),
  ConfirmPrompt: require('./confirm')
};
