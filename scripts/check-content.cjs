const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const matter = require('gray-matter');
const yaml = require('js-yaml');

const parse = raw => matter(raw, { engines: { yaml: yaml.load } });
const statuses = new Set(['featured', 'active', 'open-source', 'building', 'archived']);
let checked = 0;
for (const collection of ['posts', 'projects', 'papers', 'pages']) {
  const directory = path.join(__dirname, '..', 'content', collection);
  for (const name of fs.readdirSync(directory).filter(name => name.endsWith('.md'))) {
    const file = path.join(directory, name);
    const { data } = parse(fs.readFileSync(file, 'utf8'));
    assert(data && typeof data === 'object' && !Array.isArray(data), `${collection}/${name}: metadata must be an object`);
    assert(typeof data[collection === 'projects' ? 'name' : 'title'] === 'string', `${collection}/${name}: missing title`);
    if (collection === 'projects') assert(statuses.has(data.status), `${collection}/${name}: invalid status`);
    for (const flag of ['draft', 'featured']) {
      if (data[flag] !== undefined) assert.equal(typeof data[flag], 'boolean', `${collection}/${name}: invalid ${flag}`);
    }
    checked++;
  }
}
const fixture = parse('---\ntitle: 中文标题\ndate: 2026-10-07\ntags: [ai, cli]\ndraft: false\nlinks:\n  - label: GitHub\n    url: https://example.com\n---\n正文');
assert.equal(fixture.data.title, '中文标题');
assert(fixture.data.date instanceof Date);
assert.deepEqual(fixture.data.tags, ['ai', 'cli']);
assert.equal(fixture.data.links[0].label, 'GitHub');
assert.equal(fixture.content.trim(), '正文');
assert.throws(() => parse('---\ntitle: !!js/function "function() {}"\n---\n'));
console.log(`Content check passed: ${checked} Markdown files; YAML compatibility and unsafe-tag rejection verified.`);
