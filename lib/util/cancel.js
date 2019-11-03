'use strict';

// A place to store the most recent prompt
let activePrompt;

/**
 * Records the most recently created prompt
 */
const storeActive = prompt => activePrompt = prompt;

/**
 * Cancels the most recently created active prompt
 */
const cancelMostRecent = () => {
  if (activePrompt && !activePrompt.closed) {
    activePrompt.abort();
  }
};

module.exports = { storeActive, cancelMostRecent };