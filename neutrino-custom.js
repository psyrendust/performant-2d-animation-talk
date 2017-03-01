const merge = require('deepmerge');
const path = require('path');
const web = require('neutrino-preset-web');
const webpack = require('webpack');

module.exports = (neutrino) => {
  web(neutrino);
  const {config} = neutrino;
  config.module
    .rule('compile')
    .loader('babel', ({options}) => {
      return {
        options: merge(options, {
          presets: [
            require.resolve('babel-preset-stage-0'),
          ],
          plugins: [
            require.resolve('babel-plugin-transform-class-properties'),
            require.resolve('babel-plugin-transform-function-bind'),
            require.resolve('babel-plugin-transform-object-rest-spread'),
            [
              require.resolve('babel-plugin-transform-strict-mode'),
              {
                strict: true,
              },
            ],
            [
              require.resolve('babel-plugin-transform-es2015-classes'),
              {
                loose: false,
              },
            ],
          ],
        })
      };
    });
};
