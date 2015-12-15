import Relay from 'react-relay';

export default class RemoveBuildingMutation extends Relay.Mutation {
	static fragments = {
		building: () => Relay.QL`
			fragment on Building {
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
		return Relay.QL`mutation{removeBuilding}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on RemoveBuildingPayload {
				deletedBuildingId,
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
			connectionName: 'buildings',
			deletedIDFieldName: 'deletedBuildingId'
		}];
	}
	getVariables() {
		return {
			password: this.props.password,
			id: this.props.building.id
		};
	}
}