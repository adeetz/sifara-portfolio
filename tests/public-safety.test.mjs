import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checker = path.join(repositoryRoot, 'scripts', 'check-public-safety.mjs');

async function withFixture(files, callback) {
  const fixture = await mkdtemp(path.join(os.tmpdir(), 'sifara-portfolio-safety-'));

  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const destination = path.join(fixture, relativePath);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, content);
    }

    return await callback(fixture);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
}

function runChecker(directory) {
  return spawnSync(process.execPath, [checker, directory], { encoding: 'utf8' });
}

test('accepts clean portfolio material', async () => {
  await withFixture(
    {
      'README.md': '# SIFARA\nMateri portofolio yang telah disanitasi.\n',
      'assets/diagram.svg': '<svg xmlns="http://www.w3.org/2000/svg"></svg>\n',
    },
    (fixture) => {
      const result = runChecker(fixture);
      assert.equal(result.status, 0, result.stderr);
    },
  );
});

test('rejects sensitive configuration and export filenames', async () => {
  await withFixture({ '.env': 'APP_NAME=SIFARA\n', 'backup.sql': '-- dump\n' }, (fixture) => {
    const result = runChecker(fixture);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /\.env|backup\.sql/);
  });
});

test('rejects a hard-coded credential value', async () => {
  const keyName = ['API', 'KEY'].join('_');

  await withFixture({ 'docs/notes.md': `${keyName}=live-production-value\n` }, (fixture) => {
    const result = runChecker(fixture);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /credential-like value/i);
  });
});

test('rejects a hard-coded credential value in a JavaScript file', async () => {
  const keyName = ['API', 'KEY'].join('_');

  await withFixture({ 'scripts/example.mjs': `// ${keyName}=live-production-value\n` }, (fixture) => {
    const result = runChecker(fixture);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /credential-like value/i);
  });
});

test('rejects an active demo URL', async () => {
  const demoUrl = ['https://', 'demo.example.test/login'].join('');

  await withFixture({ 'docs/notes.md': `Walkthrough: ${demoUrl}\n` }, (fixture) => {
    const result = runChecker(fixture);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /active demo URL/i);
  });
});

test('rejects internal network addresses', async () => {
  const address = ['192', '168', '1', '20'].join('.');

  await withFixture({ 'docs/notes.md': `Server: ${address}\n` }, (fixture) => {
    const result = runChecker(fixture);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /internal IP address/i);
  });
});
