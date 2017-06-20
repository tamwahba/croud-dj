const webpackConfig = require('./webpack.config.js');

module.exports = (config) => {
  const options = {
    frameworks: ['sinon', 'mocha'],
    files: [
      'karma.entry.js',
    ],
    preprocessors: {
      'karma.entry.js': ['webpack', 'sourcemap'],
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only',
    },
    reporters: ['spec', 'coverage', 'junit'],
    coverageReporter: {
      reporters: [
        { type: 'html' },
      ],
    },
    junitReporter: {
      outputDir: './reports',
      outputFile: 'client.xml',
      useBrowserName: false,
    },
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    browsers: ['Firefox'],
  };

  config.set(options);
};
