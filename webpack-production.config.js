var path = require('path');

module.exports = {
	entry: './websrc/app.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ['react', 'es2015', 'stage-0'],
					plugins: ['./babelRelayPlugin']
				}
			}
		]
	}
};