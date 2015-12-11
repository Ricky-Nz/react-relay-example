import Relay from 'react-relay';

export default class RemoveBuildingMutation extends Relay.Mutation {
	static fragments = {
		building: () => Relay.QL`
			fragment on Building {
				id
			}
		`,
		user: () => Relay.QL`
			fragment on User {
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
				user {
					id
				}
			}
		`;
	}
	getConfigs() {
		return [{
			type: 'NODE_DELETE',
			parentName: 'user',
			parentID: this.props.user.id,
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