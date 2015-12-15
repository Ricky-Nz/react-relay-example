import Relay from 'react-relay';

export default class CreateBuildingMutation extends Relay.Mutation {
	static fragments = {
		app: () => Relay.QL`
			fragment on App {
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
				app {
					buildings
				}
			}
		`
	}
	getConfigs() {
		return [{
			type: 'RANGE_ADD',
			parentName: 'app',
			parentID: this.props.app.id,
			connectionName: 'buildings',
			edgeName: 'buildingEdge',
			rangeBehaviors: {
				'': 'append'
			}
		}];
	}
	getVariables() {
		return {
			password: this.props.password,
			name: this.props.name,
			index: this.props.index,
			order: this.props.order,
			category: this.props.category,
			promote: this.props.promote,
			location: this.props.location,
			type: this.props.type,
			area: this.props.area,
			status: this.props.status,
			labels: this.props.labels,
			segments: this.props.segments
		};
	}
	getFiles() {
		return this.props.fileMap;
	}
}