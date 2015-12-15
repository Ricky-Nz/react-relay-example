import {
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLSchema,
	GraphQLString,
} from 'graphql';

import {
	connectionArgs,
	connectionDefinitions,
	connectionFromArray,
	cursorForObjectInConnection,
	fromGlobalId,
	globalIdField,
	mutationWithClientMutationId,
	nodeDefinitions,
} from 'graphql-relay';

import {
	DBBuilding,
	createBuilding,
	updateBuilding,
	removeBuilding,
	findBuildingById,
	findBuildings,
	findPromoteBuildings,
	initApp,
	getApp,
	updateApp
} from './database';

import fs from 'fs';
import path from 'path';
import _ from 'underscore';

function confirmPassword(password) {
	return fs.readFileSync(path.join(__dirname, 'password.json'), 'utf-8') === password;
}

var GraphQLSegment = new GraphQLObjectType({
	name: 'Segment',
	description: 'Building description segment',
	fields: () => ({
		title: {
			type: GraphQLString
		},
		content: {
			type: GraphQLString
		},
		images: {
			type: new GraphQLList(GraphQLString)
		},
		mode: {
			type: GraphQLString
		}
	})
});

var GraphQLSegmentInput = new GraphQLInputObjectType({
	name: 'SegmentInput',
	description: 'Building description segment',
	fields: () => ({
		title: {
			type: GraphQLString
		},
		content: {
			type: GraphQLString
		},
		images: {
			type: new GraphQLList(GraphQLString)
		},
		mode: {
			type: GraphQLString
		}
	})
});

var GraphQLBuilding = new GraphQLObjectType({
	name: 'Building',
	description: 'buildings',
	fields: () => ({
		id: {
			type: GraphQLID,
			resolve: (obj) => obj._id
		},
		name: {
			type: GraphQLString
		},
		index: {
			type: GraphQLString
		},
		order: {
			type: GraphQLString
		},
		category: {
			type: GraphQLString
		},
		promote: {
			type: GraphQLString
		},
		location: {
			type: GraphQLString
		},
		type: {
			type: GraphQLString
		},
		area: {
			type: GraphQLString
		},
		status: {
			type: GraphQLString
		},
		banner: {
			type: GraphQLString
		},
		thumbnail: {
			type: GraphQLString
		},
		labels: {
			type: new GraphQLList(GraphQLString)
		},
		segments: {
			type: new GraphQLList(GraphQLSegment)
		}
	})
});

var {
	connectionType: BuildingsConnection,
	edgeType: GraphQLBuildingEdge
} = connectionDefinitions({
	name: 'Building',
	nodeType: GraphQLBuilding
});

var GraphQLApp = new GraphQLObjectType({
	name: 'App',
	description: 'Root object',
	fields: () => ({
		id: globalIdField('App', () => 'APPLICATION'),
		bannerCount: {
			type: GraphQLInt
		},
		categories: {
			type: new GraphQLList(GraphQLString)
		},
		labels: {
			type: new GraphQLList(GraphQLString)
		},
		projectTypes: {
			type: new GraphQLList(GraphQLString)
		},
		buildings: {
			type: BuildingsConnection,
			args: {
				labels: {
					type: new GraphQLList(GraphQLString)
				},
				...connectionArgs
			},
			resolve: (app, {labels, ...args}) =>
				findBuildings(labels)
					.then(buildings => connectionFromArray(buildings, args))
		},
		promotes: {
			type: BuildingsConnection,
			args: connectionArgs,
			resolve: (app, args) =>
				findPromoteBuildings()
					.then(buildings => connectionFromArray(buildings, args))
		},
		building: {
			type: GraphQLBuilding,
			args: {
				id: {
					type: new GraphQLNonNull(GraphQLID)
				}
			},
			resolve: (app, {id}) =>
				findBuildingById(id).then(building => building)
		}
	})
});

var GraphQLQueryRoot = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		app: {
			type: GraphQLApp,
			resolve: (root) => getApp().then(app => {
					if (app) {
						return app;
					} else {
						return initApp().then(app => app);
					}
			})
		}
	})
});

var updateAppMutation = mutationWithClientMutationId({
	name: 'UpdateApp',
	description: 'update app configuration',
	inputFields: {
		password: {
			type: new GraphQLNonNull(GraphQLString)
		},
		bannerCount: {
			type: GraphQLInt
		},
		categories: {
			type: new GraphQLList(GraphQLString)
		},
		labels: {
			type: new GraphQLList(GraphQLString)
		},
		projectTypes: {
			type: new GraphQLList(GraphQLString)
		}
	},
	outputFields: {
		app: {
			type: GraphQLApp,
			resolve: (app) => app
		}
	},
	mutateAndGetPayload: ({password, ...args}) => {
		if (confirmPassword(password)) {
			return updateApp(args).then(app => app);
		} else {
			return null;
		}
	}
});

var createBuildingMutation = mutationWithClientMutationId({
	name: 'CreateBuilding',
	inputFields: {
		password: {
			type: new GraphQLNonNull(GraphQLString)
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		index: {
			type: GraphQLString
		},
		order: {
			type: GraphQLString
		},
		category: {
			type: GraphQLString
		},
		promote: {
			type: GraphQLString
		},
		location: {
			type: GraphQLString
		},
		type: {
			type: GraphQLString
		},
		area: {
			type: GraphQLString
		},
		status: {
			type: GraphQLString
		},
		labels: {
			type: new GraphQLList(GraphQLString)
		},
		segments: {
			type: new GraphQLList(GraphQLSegmentInput)
		}
	},
	outputFields: {
		buildingEdge: {
			type: GraphQLBuildingEdge,
			resolve: ({buildingId}) =>
				findBuildings().then(buildings => {
						const newBuiding = _.find(buildings, building => building._id.toString() === buildingId.toString());
						return {
							cursor: cursorForObjectInConnection(buildings, newBuiding),
							node: newBuiding
						};
					})
		},
		app: {
			type: GraphQLApp,
			resolve: () => getApp()
		}
	},
	mutateAndGetPayload: ({password, ...fields}, {rootValue}) => {
		if (confirmPassword(password)) {
			return createBuilding(fields, rootValue.request.files)
				.then(building => ({buildingId: building._id}));
		} else {
			return null;
		}
	}
});

var updateBuildingMutation = mutationWithClientMutationId({
	name: 'UpdateBuilding',
	inputFields: {
		password: {
			type: new GraphQLNonNull(GraphQLString)
		},
		id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		name: {
			type: GraphQLString
		},
		order: {
			type: GraphQLString
		},
		category: {
			type: GraphQLString
		},
		index: {
			type: GraphQLString
		},
		promote: {
			type: GraphQLString
		},
		location: {
			type: GraphQLString
		},
		type: {
			type: GraphQLString
		},
		area: {
			type: GraphQLString
		},
		status: {
			type: GraphQLString
		},
		banner: {
			type: GraphQLString
		},
		thumbnail: {
			type: GraphQLString
		},
		labels: {
			type: new GraphQLList(GraphQLString)
		},
		segments: {
			type: new GraphQLList(GraphQLSegmentInput)
		}
	},
	outputFields: {
		building: {
			type: GraphQLBuilding,
			resolve: (buildingId) => findBuildingById(buildingId)
				.then(building => building)
		}
	},
	mutateAndGetPayload: ({password, ...fields}, {rootValue}) => {
		if (confirmPassword(password)) {
			return updateBuilding(fields, rootValue.request.files)
				.then(building => building._id);
		} else {
			return null;
		}
	}
});

var removeBuildingMutation = mutationWithClientMutationId({
	name: 'RemoveBuilding',
	inputFields: {
		password: {
			type: new GraphQLNonNull(GraphQLString)
		},
		id: {
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	outputFields: {
		deletedBuildingId: {
			type: GraphQLString,
			resolve: ({buildingId}) => buildingId
		},
		app: {
			type: GraphQLApp,
			resolve: ({buildingId}) => getApp().then(app => app)
		}
	},
	mutateAndGetPayload: ({id, password}) => {
		if (confirmPassword(password)) {
			return removeBuilding(id)
				.then(removedBuilding => ({buildingId: id}));
		} else {
			return null;
		}
	}
})

var GraphQLMutationRoot = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		updateApp: updateAppMutation,
		createBuilding: createBuildingMutation,
		updateBuilding: updateBuildingMutation,
		removeBuilding: removeBuildingMutation
	})
});

export var schema = new GraphQLSchema({
	query: GraphQLQueryRoot,
	mutation: GraphQLMutationRoot
});



