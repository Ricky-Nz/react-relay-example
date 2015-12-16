import Relay from 'react-relay';

export default class RemoveProjectMutation extends Relay.Mutation {
	static fragments = {
		project: () => Relay.QL`
			fragment on Project {
				id
			}
		`,
		app: () => Relay.QL`
			fragment on App {
				id
			}
		`
	};
	getMutation() {
		return Relay.QL`mutation{removeProject}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on RemoveProjectPayload {
				deletedProjectId,
				app {
					id
				}
			}
		`;
	}
	getConfigs() {
		return [{
			type: 'NODE_DELETE',
			parentName: 'app',
			parentID: this.props.app.id,
			connectionName: 'projects',
			deletedIDFieldName: 'deletedProjectId'
		}];
	}
	getVariables() {
		return {
			password: this.props.password,
			id: this.props.project.id
		};
	}
}