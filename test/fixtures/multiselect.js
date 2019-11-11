const prompts = require('../..');

prompts([
  {
    type: 'multiselect',
    name: 'color',
    message: 'Pick colors',
    choices: [
      { title: 'Red', value: '#ff0000' },
      { title: 'Green', value: '#00ff00' },
      { title: 'Blue', value: '#0000ff' }
    ],
    hotkeys: {
      r: {
        handle() {
          return {answers: {Red: true, Green: true}};
        },
        instruction: 'Choose Red and Green' 
      }
    }
  }
]).then(response => console.error(JSON.stringify(response, null, 2)));
