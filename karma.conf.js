module.exports = function(config) {
    config.set({
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly', 'text-summary', 'json-summary'],
            fixWebpackSourcePaths: true
        },
    })
}