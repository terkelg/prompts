const child_process = require('child_process');
const multiselectFixture = require.resolve('./fixtures/multiselect');
const readline = require('readline');

const test = require('tape');

// Running these tests will make your terminal cursor disappear. Sorry. Run `reset` to fix it.

const awaitOutput = (pipe, output) => new Promise((resolve) => {
  let allDataFromPipe = '';
  pipe.on('data', dataFromPipe => {
    allDataFromPipe += dataFromPipe;
    if (allDataFromPipe.toString().includes(output)) {
      resolve(allDataFromPipe);
    }
  });
});

const spawn = (inputs) => {
  const childProcess = child_process.spawn('node', [multiselectFixture]);
  const {stdout, stderr, stdin} = childProcess;

  // Pass this env var to get some visibility into what the subproc is doing, and also kinda break the tests.
  // But maybe it'll help you. :)
  if (process.env.DEBUG) {
    stdout.pipe(process.stdout);
    process.stdin.pipe(stdin);
  }

  childProcess.on('error', (err) => {
    console.log('Spawn error:', err);
  });

  const readlineInstance = readline.createInterface({output: stdin, input: stdin, terminal: true });

  const stderrPromise = new Promise((resolve, reject) => {
    try {
      stderr.on('data', data => {
        childProcess.kill();
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
    t.ok(stdout.includes('r: Choose Red and Green'), `Stdout includes hotkey instructions`);

    t.deepEqual(response, {
      color: ['#ff0000', '#00ff00']
    }, 'pressing hotkey selects the right answers');
    t.end();
  });
})

test('multiselect hotkey that aborts', t => {
  t.plan(2);
  spawn(['d']).then(({response, stdout}) => {
    t.ok(stdout.includes('d: Abort'), `Stdout includes hotkey instructions`);

    t.deepEqual(response, {}, 'pressing hotkey aborts the process');
    t.end();
  });
})

test('multiselect hotkey that chooses answers and submits', t => {
  t.plan(2);
  spawn(['e']).then(({response, stdout}) => {
    t.ok(
      stdout.includes('e: Select Green and Blue, and move on the to the next question'), 
      `Stdout includes hotkey instructions`
    );

    t.deepEqual(response, {
      color: ['#00ff00', '#0000ff']
    }, 'pressing hotkey chooses answers and submits');
    t.end();
  });
})

test('multiselect hotkey that chooses answers and submits', t => {
  t.plan(2);
  spawn(['a', 'f']).then(({response, stdout}) => {
    t.ok(
      stdout.includes('f: Pay respect. Also, enable Blue and disable Red.'), 
      `Stdout includes hotkey instructions`
    );

    t.deepEqual(response, {
      color: ['#00ff00', '#0000ff']
    }, 'pressing hotkey chooses answers and submits');
    t.end();
  });
})
