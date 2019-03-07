const webpack = require('webpack');

module.exports = {
	devServer: {
		proxy: {
			"/api": {
				target: "http://mrt-server:3031/"
			}
		}
	},
	configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
	},
	chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule.use('vue-svg-loader').loader('vue-svg-loader');
  }
}