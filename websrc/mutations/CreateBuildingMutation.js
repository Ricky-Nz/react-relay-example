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
			userId: this.props.user.id,
			password: this.props.password,
			name: this.props.name,
			index: this.props.index,
			order: this.props.order,
			category: this.props.category,
			label: this.props.label,
			promote: this.props.promote,
			location: this.props.location,
			type: this.props.type,
			area: this.props.area,
			status: this.props.status,
			segments: this.props.segments
		};
	}
	getFiles() {
		return this.props.fileMap;
	}
}