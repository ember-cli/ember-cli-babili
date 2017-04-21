'use strict';

module.exports = {
  name: 'ember-cli-babili',

  included(app) {
    this._super.included.apply(this, arguments);

    this.options = app.options.minifyJS || {};
    this.useSourceMaps = !!app.options.sourcemaps.enabled;
  },

  postprocessTree(type, tree) {

    if (this.options.enabled === true && type === 'all') {
      let options = {
        presets: [require('babel-preset-babili')],
        minified: true, compact: true,
        sourceMaps: this.useSourceMaps ? 'inline' : false,
        highlightCode: false,
        sourceType: 'script',
        babelrc: false,
      };

      return require('broccoli-babel-transpiler')(tree, options);
    } else {
      return tree;
    }
  },
};
