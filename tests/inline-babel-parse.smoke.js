const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

test('index.html inline Babel script parses', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const startMark = '<script type="text/babel">';
  const start = html.indexOf(startMark);
  const end = html.lastIndexOf('</script>');
  assert.ok(start >= 0 && end > start, 'inline Babel script should exist');
  const script = html.slice(start + startMark.length, end);
  assert.match(script, /onSelect:goToFile,expanded:expandedPaths/);
  assert.doesNotMatch(script, /onSelect:goToFile\},expanded/);
  assert.doesNotThrow(function () {
    // The page is createElement, not JSX. Node's parser catches the same
    // blank-screen syntax errors without loading vendor/babel in CI.
    new vm.Script(script, { filename: 'index.html' });
  });
});
