const webpack = require('webpack');

module.exports = {
	devServer: {
		proxy: {
			"/api": {
				target: "http://localhost:3031/"
			}
		}
	},
	configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
  }
}