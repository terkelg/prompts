'use strict';

const { prompt } = require('./lib');

const onState = e => {
  console.log(e);
}

(async function(){
  const questions = [
    {
      type: 'text',
      name: 'twitter1',
      message: `What's your twitter handle?`,
      onState
    },
    {
      type: 'invisible',
      name: 'twitter2',
      message: `What's your twitter handle?`,
      onState
    },
    {
      type: 'password',
      name: 'twitter3',
      message: `What's your twitter handle?`,
      onState
    },
  ];

  const answers = await prompt(questions);
  console.log(answers);

})();
