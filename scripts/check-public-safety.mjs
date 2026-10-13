import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? process.cwd());
const ignoredDirectories = new Set(['.git', '.superpowers', 'node_modules']);
const forbiddenNames = [
  /^\.env(?:\..+)?$/i,
  /^(?:composer|package|pnpm|yarn)-lock\.(?:json|yaml|yml)$/i,
  /^dockerfile(?:\..+)?$/i,
  /^docker-compose(?:\..+)?\.ya?ml$/i,
];
const forbiddenExtensions = new Set(['.sql', '.dump', '.sqlite', '.sqlite3', '.bak']);
const textExtensions = new Set(['.md', '.txt', '.json', '.svg', '.yml', '.yaml', '.html', '.css', '.js', '.cjs', '.mjs', '.ts', '.tsx', '.jsx', '.sh']);
const credentialPattern = /^\s*(?:(?:\/\/\s*)|(?:(?:export\s+)?(?:const|let|var)\s+))?[A-Z0-9_]*?(?:PASSWORD|PASS|TOKEN|SECRET|API_?KEY|PRIVATE_?KEY|ACCESS_?KEY)[A-Z0-9_]*\s*[:=]\s*(?!["']?(?:\$\{|\{\{|<|YOUR_|CHANGEME|REDACTED|EXAMPLE))\S+/im;
const demoUrlPattern = /https?:\/\/[^\s/]*(?:demo|staging|dev)[\w.-]*[^\s]*/i;
const internalIpPattern = /\b(?:10(?:\.\d{1,3}){3}|127(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/;

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) {
      continue;
    }

    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await filesIn(filename));
    } else if (entry.isFile()) {
      files.push(filename);
    }
  }

  return files;
}

function relative(filename) {
  return path.relative(root, filename).split(path.sep).join('/');
}

async function inspect(filename) {
  const issues = [];
  const basename = path.basename(filename);
  const extension = path.extname(basename).toLowerCase();
  const displayName = relative(filename);

  if (forbiddenNames.some((pattern) => pattern.test(basename)) || forbiddenExtensions.has(extension)) {
    issues.push(`${displayName}: forbidden file name`);
  }

  if (!textExtensions.has(extension)) {
    return issues;
  }

  const content = await readFile(filename, 'utf8');
  if (credentialPattern.test(content)) {
    issues.push(`${displayName}: credential-like value`);
  }
  if (demoUrlPattern.test(content)) {
    issues.push(`${displayName}: active demo URL`);
  }
  if (internalIpPattern.test(content)) {
    issues.push(`${displayName}: internal IP address`);
  }

  return issues;
}

const files = await filesIn(root);
const issues = (await Promise.all(files.map(inspect))).flat();

if (issues.length > 0) {
  console.error(`Public-safety check failed for ${root}:`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Public-safety check passed for ${root}.`);
}
