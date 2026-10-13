import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function read(relativePath) {
  return readFile(path.join(root, relativePath), 'utf8');
}

test('README explains SIFARA in Indonesian and English without offering source access', async () => {
  const readme = await read('README.md');

  assert.match(readme, /# SIFARA/);
  assert.match(readme, /Sistem Informasi Farmasi Daerah/);
  assert.match(readme, /## Ringkasan \(Indonesia\)/);
  assert.match(readme, /## English Summary/);
  assert.match(readme, /source code aplikasi tetap private/i);
  assert.match(readme, /m\.noor\.aditya\.rahman@gmail\.com/);
  assert.match(readme, /## Inspirasi dan Atribusi/);
  assert.match(readme, /\[Inventoros\]\(https:\/\/github\.com\/inventoros\/inventoros\)/);

  for (const image of ['login.png', 'dashboard.png', 'products.png', 'inventory-valuation.png']) {
    assert.match(readme, new RegExp(`assets/screenshots/${image.replace('.', '\\.')}`));
  }
});

test('supporting documents state the publication boundary and private disclosure path', async () => {
  const [caseStudy, checklist, security, license] = await Promise.all([
    read('docs/portfolio-case-study.id.md'),
    read('docs/demo-publication-checklist.md'),
    read('SECURITY.md'),
    read('LICENSE'),
  ]);

  assert.match(caseStudy, /UPTD Instalasi Farmasi Daerah/);
  assert.match(caseStudy, /tanpa source code/i);
  assert.match(checklist, /jangan.*kredensial/i);
  assert.match(security, /m\.noor\.aditya\.rahman@gmail\.com/);
  assert.match(license, /All rights reserved/i);
});

test('README screenshots and conceptual architecture are present as non-empty assets', async () => {
  const assets = [
    'assets/screenshots/login.png',
    'assets/screenshots/dashboard.png',
    'assets/screenshots/products.png',
    'assets/screenshots/inventory-valuation.png',
    'assets/diagrams/sifara-conceptual-architecture.svg',
  ];

  for (const asset of assets) {
    const metadata = await stat(path.join(root, asset));
    assert.ok(metadata.size > 0, `${asset} must not be empty`);
  }
});
