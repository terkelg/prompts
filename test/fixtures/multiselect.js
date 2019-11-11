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
  }
]).then(response => console.log(response));

// process.stdin.pipe(process.stdout);

// const readline = require('readline');

// const rl = readline.createInterface(process.stdin);
// readline.emitKeypressEvents(process.stdin, rl);

// process.stdin.on('keypress', (str, key) => console.log({str, key}));