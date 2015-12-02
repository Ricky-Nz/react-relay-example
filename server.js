import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {schema} from './data/schema';
import mongoose from 'mongoose';
import multer from 'multer';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;
mongoose.connect('mongodb://localhost/relay');

var graphQLServer = express();
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/')
	}
});
graphQLServer.use('/', multer({ storage }).any());
graphQLServer.use('/', graphQLHTTP(req => {
	return {
		schema: schema,
		rootValue: { request: req }
	};
}));
graphQLServer.listen(GRAPHQL_PORT, () =>
	console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`));

var compiler = webpack({
	devtool: 'cheap-module-eval-source-map',
	entry: path.resolve(__dirname, 'js', 'app.js'),
	module: {
		loaders: [
			{
				exclude: /node_modules/,
				loader: 'babel',
				query: {stage: 0, plugins: ['./build/babelRelayPlugin']},
				test: /\.js$/
			}
		]
	},
	output: {
		filename: 'app.js',
		path: '/'
	}
});

var app = new WebpackDevServer(compiler, {
	contentBase: '/public/',
	proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
	publicPath: '/js/',
	stats: {colors: true}
});

app.use('/resources', express.static(path.resolve(__dirname, 'uploads')));
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () =>
	console.log(`App is now running on http://localhost:${APP_PORT}`));


