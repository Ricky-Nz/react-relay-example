import express from 'express';
import graphQLHTTP from 'express-graphql';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { schema } from './schema';

mongoose.connect('mongodb://localhost/arcstudio');

var graphQLServer = express();
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/')
	}
});
graphQLServer.use('/', multer({ storage }).any());
graphQLServer.use('/api', graphQLHTTP(req => ({
	schema,
	rootValue: { request: req }
})));
graphQLServer.use('/uploads', express.static(path.join(__dirname, 'uploads')));
graphQLServer.use('/', express.static(path.join(__dirname, '..', 'dist')));

graphQLServer.listen(3000, () =>
	console.log(`GraphQL Server now running on: ${3000}`));