const child_process = require('child_process');
const multiselectFixture = require.resolve('./fixtures/multiselect');
const readline = require('readline');
const {Readable} = require('stream');

const test = require('tape');

const awaitOutput = (pipe, output) => new Promise((resolve) => {
  pipe.on('data', data => {
    if (data.toString().includes(output)) {
      resolve();
    }
  })
});

class EmptyStream extends Readable {
  _read() {
    return '';
  }
}

test('multiselect', t => {
  const {stdout, stdin} = child_process.spawn('node', [multiselectFixture]);
  stdout.pipe(process.stdout);
  process.stdin.pipe(stdin);

  const readlineInstance = readline.createInterface({output: stdin, input: stdin, terminal: true });
  readlineInstance.write('a\n');
  
  // awaitOutput(stdout, 'Blue').then(() => {
    
    
  //   console.log('writing');
  //   // process.stdin.write('a\n');
  //   // readlineInstance.write(undefined, {name: 'a', ctrl: true});
  //   // readlineInstance.write('a\n');
  //   readlineInstance.write(undefined, {name: 'enter'});
  //   readlineInstance.write('\n');

  //   t.end();
  // })
})


// const {stdout, stdin} = child_process.spawn('node', [multiselectFixture]);
// stdout.pipe(process.stdout);

// const readlineInstance = readline.createInterface({output: stdin, input: stdin, terminal: true });
// readlineInstance.write('af');