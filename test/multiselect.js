const child_process = require('child_process');
const multiselectFixture = require.resolve('./fixtures/multiselect');
const readline = require('readline');

const test = require('tape');

const awaitOutput = (pipe, output) => new Promise((resolve) => {
  let allDataFromPipe = '';
  const handleDataFromPipe = dataFromPipe => {
    allDataFromPipe += dataFromPipe;
    if (allDataFromPipe.toString().includes(output)) {
      pipe.removeListener('data', handleDataFromPipe);
      resolve(allDataFromPipe);
    }
  };

  pipe.on('data', handleDataFromPipe);
});

const spawn = (inputs) => {
  const childProcess = child_process.spawn('node', [multiselectFixture]);
  const {stdout, stderr, stdin} = childProcess;
  // stdout.pipe(process.stdout);
  // process.stdin.pipe(stdin);

  // TODO: see if we can remove some of this stream closing.

  childProcess.on('exit', () => {
    console.log('exit');
  })
  childProcess.on('error', (err) => {
    console.log('error', err);
  })

  const readlineInstance = readline.createInterface({output: stdin, input: stdin, terminal: true });

  const stderrPromise = new Promise((resolve, reject) => {
    try {
      stderr.on('data', data => {
        childProcess.kill();
        readlineInstance.close();
        stdout.unpipe(process.stdout);
        // I hope the JSON output always comes as a single data event.
        resolve(JSON.parse(data.toString()));
      })
    } catch (e) {
      reject(e);
    }
  })

  const stdoutPromise = awaitOutput(stdout, 'Blue').then(allDataFromPipe => {
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
    return allDataFromPipe;
  });
  
  return Promise.all([stderrPromise, stdoutPromise]).then(([childProcessResponse, childProcessStdout]) => ({
    response: childProcessResponse,
    stdout: childProcessStdout
  }));
}

test('multiselect "a"', t => {
  t.plan(1);
  spawn(['a', {name: 'enter'}]).then(({response}) => {
    t.deepEqual(response, {
      color: ['#ff0000', '#00ff00', '#0000ff']
    }, 'pressing "a" selects all options');
    t.end();
  });
})

test('multiselect hotkey that selects multiple answers', t => {
  t.plan(2);
  spawn(['r', {name: 'enter'}]).then(({response, stdout}) => {
    t.ok(stdout.includes('r: Choose Red and Green'), `"${stdout}" includes hotkey instructions`);

    t.deepEqual(response, {
      color: ['#ff0000', '#00ff00']
    }, 'pressing hotkey selects the right answers');
    t.end();
  });
})
