module.exports = {
  entry: ['./client/index.js'],
  mode: 'production',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
  },
  context: __dirname,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /node_modules/
      }
    ],
  },
};
