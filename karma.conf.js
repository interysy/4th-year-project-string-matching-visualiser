module.exports = function (config) {
    config.set({
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('@angular-devkit/build-angular/plugins/karma'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage-istanbul-reporter'),
        require("karma-chrome-launcher"),
      ],
      browsers: ['Chrome', 'ChromeHeadless' ],
      singleRun: true,
      reporters: ['progress', 'coverage-istanbul'],
      coverageIstanbulReporter: {
        reports: ['html', 'json', 'text-summary'],
        fixWebpackSourcePaths: true
      },
    });
  };
