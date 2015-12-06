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
	DBUser,
	DBBuilding,
	findBuildingById,
	findUserById,
	findBuildingsByUser,
	findPromoteBuildingsByUser,
	findUserByName,
	createUser,
	updateUser,
	createBuilding,
	updateBuilding,
	removeBuilding
} from './database';

import _ from 'underscore';

var {nodeInterface, nodeField} = nodeDefinitions(
	(globalId) => {
		const {type, id} = fromGlobalId(globalId);
		if (type === 'User') {
			return findUserById(id)
				.then(user => user);
		} else if (type === 'Building') {
			return findBuildingById(id)
				.then(building => building);
		} else {
			return null;
		}
	},
	(obj) => {
		if (obj instanceof DBUser) {
			return GraphQLUser;
		} else if (obj instanceof DBBuilding) {
			return GraphQLBuilding;
		} else {
			return null;
		}
	}
);

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
	description: 'User buildings',
	fields: () => ({
		id: globalIdField('Building', (obj) => obj._id),
		name: {
			type: GraphQLString
		},
		index: {
			type: GraphQLString
		},
		category: {
			type: GraphQLString
		},
		label: {
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
		segments: {
			type: new GraphQLList(GraphQLSegment)
		}
	}),
	interfaces: [nodeInterface]
});

var {
	connectionType: BuildingsConnection,
	edgeType: GraphQLBuildingEdge
} = connectionDefinitions({
	name: 'Building',
	nodeType: GraphQLBuilding
});

var GraphQLUser = new GraphQLObjectType({
	name: 'User',
	description: 'User object',
	fields: () => ({
		id: globalIdField('User', (obj) => obj._id),
		name: {
			type: GraphQLString
		},
		categories: {
			type: new GraphQLList(GraphQLString)
		},
		labels: {
			type: new GraphQLList(GraphQLString)
		},
		buildings: {
			type: BuildingsConnection,
			args: connectionArgs,
			resolve: (user, args) => {
				return findBuildingsByUser(user._id)
					.then(buildings => connectionFromArray(buildings, args));
			}
		},
		promotes: {
			type: BuildingsConnection,
			args: connectionArgs,
			resolve: (user, args) => {
				return findPromoteBuildingsByUser(user._id)
					.then(buildings => connectionFromArray(buildings, args));
			}
		}
	}),
	interfaces: [nodeInterface]
});

var GraphQLApp = new GraphQLObjectType({
	name: 'App',
	description: 'Root object',
	fields: () => ({
		user: {
			type: GraphQLUser,
			args: {
				name: {
					type: GraphQLString
				}
			},
			resolve: (app, {name}) =>
				findUserByName(name||'ruiqi').then(user => user)
		},
		building: {
			type: GraphQLBuilding,
			args: {
				id: {
					type: new GraphQLNonNull(GraphQLID)
				}
			},
			resolve: (root, {id}) => {
				const {type, id: localId} = fromGlobalId(id);
				return findBuildingById(localId).then(building => building);
			}
		}
	})
});

var queryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		app: {
			type: GraphQLApp,
			resolve: (root) => ({})
		}
	})
});

var createUserMutation = mutationWithClientMutationId({
	name: 'CreateUser',
	description: 'Create new user',
	inputFields: {
		name: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	outputFields: {
		user: {
			type: GraphQLUser,
			resolve: ({userId}) =>
				findUserById(userId).then(user => user)
		}
	},
	mutateAndGetPayload: ({name}) =>
		createUser(name).then(user => ({userId: user._id}))
});

var updateUserMutation = mutationWithClientMutationId({
	name: 'UpdateUser',
	description: 'update user configuration',
	inputFields: {
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		categories: {
			type: new GraphQLList(GraphQLString)
		},
		labels: {
			type: new GraphQLList(GraphQLString)
		}
	},
	outputFields: {
		user: {
			type: GraphQLUser,
			resolve: ({userId}) =>
				findUserById(userId).then(user => user)
		}
	},
	mutateAndGetPayload: (args) =>
		updateUser(args).then(user => ({userId: user._id}))
})

var createBuildingMutation = mutationWithClientMutationId({
	name: 'CreateBuilding',
	inputFields: {
		userId: {
			type: new GraphQLNonNull(GraphQLID)
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		index: {
			type: GraphQLString
		},
		category: {
			type: GraphQLString
		},
		label: {
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
		segments: {
			type: new GraphQLList(GraphQLSegmentInput)
		}
	},
	outputFields: {
		buildingEdge: {
			type: GraphQLBuildingEdge,
			resolve: ({buildingId, userId}) =>
				findBuildingsByUser(userId)
					.then(buildings => {
						const newBuiding = _.find(buildings, building => building._id.toString() === buildingId.toString());
						return {
							cursor: cursorForObjectInConnection(buildings, newBuiding),
							node: newBuiding
						};
					})
		},
		user: {
			type: GraphQLUser,
			resolve: ({buildingId, userId}) => {
				return findUserById(userId)
					.then(user => user);
			}
		}
	},
	mutateAndGetPayload: ({userId, ...fields}, {rootValue}) => {
		const {type, id} = fromGlobalId(userId);
		return createBuilding({userId: id, ...fields}, rootValue.request.files)
			.then(building => ({
				buildingId: building._id,
				userId: id
			}));
	}
});

var updateBuildingMutation = mutationWithClientMutationId({
	name: 'UpdateBuilding',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLID)
		},
		name: {
			type: new GraphQLNonNull(GraphQLString)
		},
		category: {
			type: GraphQLString
		},
		label: {
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
	mutateAndGetPayload: ({id, ...fields}, {rootValue}) => {
		const {type, id: buildingId} = fromGlobalId(id);
		return updateBuilding({id: buildingId, ...fields}, rootValue.request.files)
			.then(building => building._id);
	}
});

var removeBuildingMutation = mutationWithClientMutationId({
	name: 'RemoveBuilding',
	inputFields: {
		id: {
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	outputFields: {
		deletedBuildingId: {
			type: GraphQLString,
			resolve: ({buildingId, userId}) => buildingId
		},
		user: {
			type: GraphQLUser,
			resolve: ({buildingId, userId}) => findUserById(userId)
				.then(user => user)
		}
	},
	mutateAndGetPayload: ({id}) => {
		const {type, id: localId} = fromGlobalId(id);
		return removeBuilding(localId)
			.then(removedBuilding => ({
				buildingId: id,
				userId: removedBuilding.userId
			}));
	}
})

var mutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		createUser: createUserMutation,
		updateUser: updateUserMutation,
		createBuilding: createBuildingMutation,
		updateBuilding: updateBuildingMutation,
		removeBuilding: removeBuildingMutation
	})
});

export var schema = new GraphQLSchema({
	query: queryType,
	mutation: mutationType
});



