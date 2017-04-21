'use strict';

const fs = require('fs');
const path = require('path');
const Plugin = require('broccoli-plugin');
const transform = require('babel-core').transform;
const walkSync = require('walk-sync');
const symlinkOrCopy = require('symlink-or-copy');

module.exports = class BabiliPlugin extends Plugin {
  constructor(tree, _options) {
    super([tree]);

    let options = _options || {};
    let babelOptions = Object.assign({}, {
      presets: [require('babel-preset-babili')],
      minified: true,
      compact: true,
      sourceMaps: true,
      highlightCode: false,
      sourceType: 'script',
      babelrc: false,
    }, options.babel);

    this.babelOptions = babelOptions;
    this.annotation = 'ember-cli-babili';
  }

  build() {
    let inputPath = this.inputPaths[0];
    let outputPath = this.outputPath;

    let files = walkSync(inputPath);

    files.forEach(relativePath => {
      let fullInputPath = path.join(inputPath, relativePath);
      let fullOutputPath = path.join(outputPath, relativePath);
      let mapFile = `${fullOutputPath.replace(/\.js$/, '')}.map`;
      let mapURL = path.basename(mapFile);

      // create directories
      if (relativePath.endsWith('/')) {
        fs.mkdirSync(fullOutputPath);
        return;
      }

      // non-js files (pass through)
      if (path.extname(relativePath) !== '.js') {
        symlinkOrCopy.sync(fullInputPath, fullOutputPath);
        return;
      }

      let options = Object.assign({}, this.babelOptions, {
        filename: relativePath,
        sourceMapTarget: path.basename(relativePath),
        sourceFileName: path.basename(relativePath),
      });

      let contents = fs.readFileSync(fullInputPath, { encoding: 'utf8' });
      let output = this.transform(contents, options);


      let finalContents = output.code;

      if (options.sourceMaps) {
        finalContents = `${finalContents}\n//# sourceMappingURL=${mapURL}\n`;
      }

      fs.writeFileSync(fullOutputPath, finalContents, { encoding: 'utf8' });

      if (options.sourceMaps) {
        let map = output.map;
        if (map.sourcesContent || map.sourcesContent.length === 0) {
          map.sourcesContent = [contents];
        }

        fs.writeFileSync(mapFile, JSON.stringify(map), { encoding: 'utf8' });
      }
    });
  }

  transform(string, options) {
    return transform(string, options);
  }
};
