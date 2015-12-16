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
	DBProject,
	createProject,
	updateProject,
	removeProject,
	findProjectById,
	findProjects,
	findPromoteProjects,
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
	description: 'Project description segment',
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
	description: 'Project description segment',
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

var GraphQLProject = new GraphQLObjectType({
	name: 'Project',
	description: 'projects',
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
	connectionType: ProjectsConnection,
	edgeType: GraphQLProjectEdge
} = connectionDefinitions({
	name: 'Project',
	nodeType: GraphQLProject
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
		projects: {
			type: ProjectsConnection,
			args: {
				labels: {
					type: new GraphQLList(GraphQLString)
				},
				...connectionArgs
			},
			resolve: (app, {labels, ...args}) =>
				findProjects(labels)
					.then(projects => connectionFromArray(projects, args))
		},
		promotes: {
			type: ProjectsConnection,
			args: connectionArgs,
			resolve: (app, args) =>
				findPromoteProjects()
					.then(projects => connectionFromArray(projects, args))
		},
		project: {
			type: GraphQLProject,
			args: {
				id: {
					type: new GraphQLNonNull(GraphQLID)
				}
			},
			resolve: (app, {id}) =>
				findProjectById(id).then(project => project)
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

var createProjectMutation = mutationWithClientMutationId({
	name: 'CreateProject',
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
		projectEdge: {
			type: GraphQLProjectEdge,
			resolve: ({projectId}) =>
				findProjects().then(projects => {
						const newBuiding = _.find(projects, project => project._id.toString() === projectId.toString());
						return {
							cursor: cursorForObjectInConnection(projects, newBuiding),
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
			return createProject(fields, rootValue.request.files)
				.then(project => ({projectId: project._id}));
		} else {
			return null;
		}
	}
});

var updateProjectMutation = mutationWithClientMutationId({
	name: 'UpdateProject',
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
		project: {
			type: GraphQLProject,
			resolve: (projectId) => findProjectById(projectId)
				.then(project => project)
		}
	},
	mutateAndGetPayload: ({password, ...fields}, {rootValue}) => {
		if (confirmPassword(password)) {
			return updateProject(fields, rootValue.request.files)
				.then(project => project._id);
		} else {
			return null;
		}
	}
});

var removeProjectMutation = mutationWithClientMutationId({
	name: 'RemoveProject',
	inputFields: {
		password: {
			type: new GraphQLNonNull(GraphQLString)
		},
		id: {
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	outputFields: {
		deletedProjectId: {
			type: GraphQLString,
			resolve: ({projectId}) => projectId
		},
		app: {
			type: GraphQLApp,
			resolve: ({projectId}) => getApp().then(app => app)
		}
	},
	mutateAndGetPayload: ({id, password}) => {
		if (confirmPassword(password)) {
			return removeProject(id)
				.then(removedProject => ({projectId: id}));
		} else {
			return null;
		}
	}
})

var GraphQLMutationRoot = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		updateApp: updateAppMutation,
		createProject: createProjectMutation,
		updateProject: updateProjectMutation,
		removeProject: removeProjectMutation
	})
});

export var schema = new GraphQLSchema({
	query: GraphQLQueryRoot,
	mutation: GraphQLMutationRoot
});



