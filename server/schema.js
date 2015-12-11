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

import fs from 'fs';
import path from 'path';
import _ from 'underscore';

function confirmPassword(password) {
	return fs.readFileSync(path.join(__dirname, 'password.json'), 'utf-8') === password;
}

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
		order: {
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
			resolve: (user, {labels, ...args}) =>
				findBuildingsByUser(user._id, labels)
					.then(buildings => connectionFromArray(buildings, args))
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
				findUserByName(name||'ruiqi').then(user => {
					if (!user) {
						return createUser('ruiqi').then(user => user);
					} else {
						return user;
					}
				})
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

var updateUserMutation = mutationWithClientMutationId({
	name: 'UpdateUser',
	description: 'update user configuration',
	inputFields: {
		password: {
			type: new GraphQLNonNull(GraphQLString)
		},
		name: {
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
		user: {
			type: GraphQLUser,
			resolve: ({userId}) =>
				findUserById(userId).then(user => user)
		}
	},
	mutateAndGetPayload: ({password, ...args}) => {
		if (confirmPassword(password)) {
			return updateUser(args).then(user => ({userId: user._id}));
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
		userId: {
			type: new GraphQLNonNull(GraphQLID)
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
	mutateAndGetPayload: ({userId, password, ...fields}, {rootValue}) => {
		if (confirmPassword(password)) {
			const {type, id} = fromGlobalId(userId);
			return createBuilding({userId: id, ...fields}, rootValue.request.files)
				.then(building => ({
					buildingId: building._id,
					userId: id
				}));
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
			type: new GraphQLNonNull(GraphQLString)
		},
		order: {
			type: GraphQLString
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
	mutateAndGetPayload: ({id, password, ...fields}, {rootValue}) => {
		if (confirmPassword(password)) {
			const {type, id: buildingId} = fromGlobalId(id);
			return updateBuilding({id: buildingId, ...fields}, rootValue.request.files)
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
			resolve: ({buildingId, userId}) => buildingId
		},
		user: {
			type: GraphQLUser,
			resolve: ({buildingId, userId}) => findUserById(userId)
				.then(user => user)
		}
	},
	mutateAndGetPayload: ({id, password}) => {
		if (confirmPassword(password)) {
			const {type, id: localId} = fromGlobalId(id);
			return removeBuilding(localId)
				.then(removedBuilding => ({
					buildingId: id,
					userId: removedBuilding.userId
				}));
		} else {
			return null;
		}
	}
})

var mutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
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



