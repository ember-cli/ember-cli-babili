'use strict';

module.exports = {
  name: 'ember-cli-babili',

  included(app) {
    this._super.included.apply(this, arguments);

    this.options = app.options.minifyJS || {};
    this.useSourceMaps = this.options.sourceMaps || app.options.sourcemaps.enabled;
  },

  postprocessTree(type, tree) {

    if (this.options.enabled === true && type === 'all') {
      let babelOptions = Object.assign({}, {
        sourceMaps: this.useSourceMaps === 'undefined' ? true : this.useSourceMaps,
      }, this.options.babiliOptions);

      let options = {
        babel: babelOptions,
      };

      const BabiliPlugin = require('./babili-plugin');
      return new BabiliPlugin(tree, options);
    } else {
      return tree;
    }
  },
};
