import Relay from 'react-relay';

export default class CreateBuildingMutation extends Relay.Mutation {
	static fragments = {
		user: () => Relay.QL`
			fragment on User {
				id
			}
		`
	};
	getMutation() {
		return Relay.QL`mutation{createBuilding}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on CreateBuildingPayload {
				buildingEdge,
				user {
					buildings
				}
			}
		`
	}
	getConfigs() {
		return [{
			type: 'RANGE_ADD',
			parentName: 'user',
			parentID: this.props.user.id,
			connectionName: 'buildings',
			edgeName: 'buildingEdge',
			rangeBehaviors: {
				'': 'append'
			}
		}];
	}
	getVariables() {
		return {
			userId: this.props.userId,
			title: this.props.title,
			index: this.props.index,
			description: this.props.description,
			labels: this.props.labels
		};
	}
	getFiles() {
		return {
			file: this.props.file
		};
	}
}