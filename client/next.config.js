module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;

    return config;
  },
};
