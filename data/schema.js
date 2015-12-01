import {
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
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
	findUserByName,
	createUser,
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

var GraphQLBuilding = new GraphQLObjectType({
	name: 'Building',
	description: 'User buildings',
	fields: () => ({
		id: globalIdField('Building', (obj) => obj._id),
		title: {
			type: GraphQLString
		},
		index: {
			type: GraphQLString
		},
		description: {
			type: GraphQLString
		},
		thumbnail: {
			type: GraphQLString
		},
		labels: {
			type: new GraphQLList(GraphQLString)
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
		buildings: {
			type: BuildingsConnection,
			args: connectionArgs,
			resolve: (user, args) => {
				return findBuildingsByUser(user._id)
					.then(buildings => connectionFromArray(buildings, args));
			}
		}
	}),
	interfaces: [nodeInterface]
});

var queryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		user: {
			type: GraphQLUser,
			args: {
				name: {
					type: new GraphQLNonNull(GraphQLString)
				}
			},
			resolve: (root, {name}) => {
				return findUserByName(name)
					.then(user => user);
			}
		},
		node: nodeField
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
			resolve: ({userId}) => {
				return findUserById(userId)
					.then(user => user);
			}
		}
	},
	mutateAndGetPayload: ({name}) => {
		return createUser(name)
			.then(user => ({
				userId: user._id
			}));
	}
})

var createBuildingMutation = mutationWithClientMutationId({
	name: 'CreateBuilding',
	inputFields: {
		userId: {
			type: new GraphQLNonNull(GraphQLID)
		},
		title: {
			type: new GraphQLNonNull(GraphQLString)
		},
		index: {
			type: new GraphQLNonNull(GraphQLString)
		},
		description: {
			type: GraphQLString
		},
		labels: {
			type: new GraphQLList(GraphQLString)
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
	mutateAndGetPayload: ({userId, title, index, description, labels}, {rootValue}) => {
		const file = rootValue.request.file;
		const {type, id} = fromGlobalId(userId);
		return createBuilding(id, title, index, description, file&&file.path, labels)
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
		title: {
			type: GraphQLString
		},
		index: {
			type: GraphQLString
		},
		description: {
			type: GraphQLString
		},
		labels: {
			type: GraphQLString
		}
	},
	outputFields: {
		building: {
			type: GraphQLBuilding,
			resolve: ({buildingId}) => findBuildingById(buildingId)
				.then(building => building)
		}
	},
	mutateAndGetPayload: ({id, title, index, description, labels}, {rootValue}) => {
		const {type, id: localId} = fromGlobalId(id);
		const file = rootValue.request.file;
		return updateBuilding(localId, title, index, description, file&&file.path, labels)
			.then(building => ({
				buildingId: building._id
			}));
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
		createBuilding: createBuildingMutation,
		updateBuilding: updateBuildingMutation,
		removeBuilding: removeBuildingMutation
	})
});

export var schema = new GraphQLSchema({
	query: queryType,
	mutation: mutationType
});



