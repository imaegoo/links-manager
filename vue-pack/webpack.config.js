const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/i,
        loader: "css-loader"
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
