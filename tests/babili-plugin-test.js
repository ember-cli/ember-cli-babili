'use strict';

const BabiliPlugin = require('../lib/babili-plugin');
const BroccoliTestHelper = require('broccoli-test-helper');
const createTempDir = BroccoliTestHelper.createTempDir;
const _createBuilder = BroccoliTestHelper.createBuilder;
const co = require('co');

const describe = QUnit.module;
const it = QUnit.test;

describe('babili-plugin', function(hooks) {
  let input, output;

  function createBuilder(options) {
    let plugin = new BabiliPlugin(input.path(), options);

    output = _createBuilder(plugin);
  }

  hooks.beforeEach(co.wrap(function *() {
    input = yield createTempDir();
  }));

  hooks.afterEach(co.wrap(function *() {
    yield input.dispose();
    yield output.dispose();
  }));

  it('builds without errors', co.wrap(function *(assert) {
    input.write({
      'some.js': `
function foo() {
  var whateverLongLOL = "derp";
  return whateverLongLOL;
}
      `,
    });

    createBuilder({ babel: { sourceMaps: false } });

    yield output.build();

    assert.deepEqual(output.read(), {
      'some.js': 'function foo(){return"derp"}',
    });
  }));

  it('passes through non-js content', co.wrap(function *(assert) {
    input.write({
      'some.txt': `whatever lol`,
    });

    createBuilder({ babel: { sourceMaps: false } });

    yield output.build();

    assert.deepEqual(output.read(), {
      'some.txt': `whatever lol`,
    });
  }));

  it('adds sourcemap URL and generates source map', co.wrap(function *(assert) {
    input.write({
      'some.js': ``,
    });

    createBuilder();

    yield output.build();

    assert.deepEqual(output.read(), {
      'some.js': `\n//# sourceMappingURL=some.map\n`,
      'some.map': `{\"version\":3,\"sources\":[],\"names\":[],\"mappings\":\"\",\"file\":\"some.js\",\"sourcesContent\":[\"\"]}`,
    });
  }));
});
