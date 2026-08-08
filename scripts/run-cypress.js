const { spawn } = require('child_process');
const path = require('path');

const cypressCommand = process.execPath;
const cypressCliPath = path.join(process.cwd(), 'node_modules', 'cypress', 'bin', 'cypress');
const cypressArgs = [cypressCliPath, ...process.argv.slice(2)];

const warningStart = 'Warning: The allowCypressEnv configuration option is enabled.';
const warningEnd = 'Learn more: https://on.cypress.io/cypress-env-migration';

function createWarningFilter(outputStream) {
  let buffer = '';
  let suppressing = false;

  function flushLines(force = false) {
    const normalized = buffer.replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');

    if (!force) {
      buffer = lines.pop();
    } else {
      buffer = '';
    }

    for (const line of lines) {
      if (!suppressing && line.includes(warningStart)) {
        suppressing = true;
        continue;
      }

      if (suppressing) {
        if (line.includes(warningEnd)) {
          suppressing = false;
        }
        continue;
      }

      outputStream.write(`${line}\n`);
    }
  }

  return (chunk) => {
    buffer += chunk.toString();
    flushLines(false);
  };
}

const child = spawn(cypressCommand, cypressArgs, {
  cwd: process.cwd(),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: false,
});

const stdoutFilter = createWarningFilter(process.stdout);
const stderrFilter = createWarningFilter(process.stderr);

child.stdout.on('data', stdoutFilter);
child.stderr.on('data', stderrFilter);

child.stdout.on('end', () => stdoutFilter(Buffer.from('\n')));
child.stderr.on('end', () => stderrFilter(Buffer.from('\n')));

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

child.on('error', (error) => {
  console.error(error.message);
  process.exit(1);
});