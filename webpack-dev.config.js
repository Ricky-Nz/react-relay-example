var path = require('path');

module.exports = {
	entry: [
		'webpack-dev-server/client?http://localhost:8080',
		'./websrc/app.js'
	],
	output: {
		publicPath: '/',
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
	},
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		host: '0.0.0.0',
		port: 8080,
		historyApiFallback: true,
		proxy: {
			'/api/graphql': {
				target: 'http://0.0.0.0:3000',
				secure: false
			},
			'/uploads/*': {
				target: 'http://0.0.0.0:3000',
				secure: false
			}
		}
	}
};