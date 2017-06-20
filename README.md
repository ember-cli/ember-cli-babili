# Ember-cli-babili

Minify javascript using babili in Ember-CLI

## Install

```sh
npm uninstall --save-dev ember-cli-uglify && \
npm install --save-dev ember-cli-babili
```

## Configuration
You can pass options to babili in `ember-cli-build.js` under the `minifyJS` key
```js
minifyJS: {
  babiliOptions: {
  // Pass options here
  }
}
```

## License

This project is licensed under the [BSD 2-Clause License](LICENSE).
