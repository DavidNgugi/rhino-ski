var path = require('path');

module.exports = {
    entry: "./js/main.js",
    output: {
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js"
    },
    mode: process.env.APP_ENV || "development",
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["babel-preset-env"]
            }
          }
        }
      ]
    }
  };