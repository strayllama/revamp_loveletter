const config = {
  entry: __dirname + '/client/src/runner.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/client/public/'
  },
  mode: 'development'
};

module.exports = config;
