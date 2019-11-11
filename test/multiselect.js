const child_process = require('child_process');
const multiselectFixture = require.resolve('./fixtures/multiselect');
const readline = require('readline');

const test = require('tape');

const awaitOutput = (pipe, output) => new Promise((resolve) => {
  const handleData = data => {
    if (data.toString().includes(output)) {
      pipe.removeListener('data', handleData);
      resolve();
    }
  };

  pipe.on('data', handleData);
});

const spawn = (inputs) => {
  const childProcess = child_process.spawn('node', [multiselectFixture]);
  const {stdout, stderr, stdin} = childProcess;
  // stdout.pipe(process.stdout);
  // process.stdin.pipe(stdin);

  childProcess.on('exit', () => {
    console.log('exit');
  })
  childProcess.on('error', (err) => {
    console.log('error', err);
  })

  const readlineInstance = readline.createInterface({output: stdin, input: stdin, terminal: true });

  return new Promise((resolve, reject) => {
    try {
      stderr.on('data', data => {
        childProcess.kill();
        readlineInstance.close();
        stdout.unpipe(process.stdout);
        // I hope the JSON output always comes as a single data event.
        resolve(JSON.parse(data.toString()));
      })
  
      awaitOutput(stdout, 'Blue').then(() => {
        inputs.forEach(input => {
          if (typeof input === 'string') {
            readlineInstance.write(input);
          } else if (typeof input === 'object') {
            readlineInstance.write(undefined, input);
          } else {
            throw new Error(
              'Argument error: every element of spawn()s input array should be a string or an object, ' +
                `but "${input}" was passed.`);
          }
        })
      }, reject);
    } catch (e) {
      reject(e);
    }
  }) 

}

test('multiselect', t => {
  t.plan(1);
  spawn(['a', {name: 'enter'}]).then(response => {
    t.deepEqual(response, {
      color: ['#ff0000', '#00ff00', '#0000ff']
    }, 'pressing "a" selects all options');
    t.end();
  });
})
