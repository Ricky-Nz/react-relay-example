import fs from 'fs';
import path from 'path';
import { schema } from './server/schema';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

const updateFunc = async () => {
	var result = await (graphql(schema, introspectionQuery));
	if (result.errors) {
		console.error('ERROR introspecting schema: ',
			JSON.stringify(result.errors, null, 2));
	} else {
		fs.writeFileSync(path.join(__dirname, './server/schema.json'),
			JSON.stringify(result, null, 2));
	}
};

updateFunc();

// Save user readable type system shorthand of schema
fs.writeFileSync(
	path.join(__dirname, './server/schema.graphql'),
	printSchema(schema)
);