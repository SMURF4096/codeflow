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
  const babelSrc = fs.readFileSync(path.join(__dirname, '..', 'vendor/babel/babel.min.js'), 'utf8');
  const ctx = { console, document: { currentScript: null } };
  ctx.self = ctx;
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(babelSrc, ctx);
  assert.ok(ctx.Babel && typeof ctx.Babel.transform === 'function', 'vendored Babel should load');
  assert.doesNotThrow(function () {
    ctx.Babel.transform(script, { presets: ['react'] });
  });
});
