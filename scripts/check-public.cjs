const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {cwd:root}).toString().split('\0').filter(Boolean);
const failures = [];
let checked = 0;
for (const name of new Set(files)) {
  const file = path.join(root, name);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
  if (/^(?:\.deploy|\.next|node_modules)\//.test(name) || /(?:BingSiteAuth\.xml|\.sqlite3?$|\.db$|\.pem$|\.key$)/i.test(name) || (/^\.env/.test(name) && name !== '.env.example')) {
    failures.push(name + ': forbidden artifact'); continue;
  }
  if (/\.(png|jpg|ico)$/.test(name)) continue;
  const value = fs.readFileSync(file, 'utf8');
  const rules = [
    ['private key', /-----BEGIN (?:OPENSSH |RSA |EC )?PRIVATE KEY-----/],
    ['access token', /(?:gh[pousr]_[A-Za-z0-9]{20,}|sk-proj-[A-Za-z0-9_-]{20,}|sk-ant-api[A-Za-z0-9_-]{20,})/],
    ['private machine path', /(?:\/Users\/[a-zA-Z][^/\s]*\/|[CD]:\\Users\\)/],
    ['unexpected deployment host', /(?:https?:\/\/[^\s"'<>]+\.org\.cn|\b(?!127\.0\.0\.1\b|0\.0\.0\.0\b|192\.0\.2\.\d{1,3}\b|198\.51\.100\.\d{1,3}\b|203\.0\.113\.\d{1,3}\b)(?:\d{1,3}\.){3}\d{1,3}\b)/],
    ['personal contact', /[A-Z0-9._%+-]+@(?:gmail|outlook|qq|163)\.com/i],
  ];
  // The guard itself contains examples of the forbidden patterns, not data.
  if (name !== 'scripts/check-public.cjs') for (const [label, regex] of rules) if (regex.test(value)) failures.push(name + ': ' + label);
  checked++;
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('Public snapshot check passed: ' + checked + ' text files; artifact and sensitive-pattern guards passed. Manual review is still required.');
