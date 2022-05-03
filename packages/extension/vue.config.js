module.exports = {
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        contentScripts: {
          entries: {
            'content-script': ['src/content-scripts/content-script.ts'],
          },
        },
      },
    },
  },

  transpileDependencies: ['vuetify'],

  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require('postcss-parent-selector')({
            selector: '.postcsswrapper',
          }),
        ],
      },
    },
    extract: false,
  },

  configureWebpack: {
    devtool: 'source-map',
  },
};
