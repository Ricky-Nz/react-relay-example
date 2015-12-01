import Relay from 'react-relay';

export default class UpdateBuildingMutation extends Relay.Mutation {
	static fragments = {
		building: () => Relay.QL`
			fragment on Building {
				id
			}
		`
	};
	getMutation() {
		return Relay.QL`mutation{updateBuilding}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on UpdateBuildingPayload {
				building {
					id,
					title,
					index,
					description,
					labels,
					thumbnail
				}
			}
		`;
	}
	getConfigs() {
		return [{
			type: 'FIELDS_CHANGE',
			fieldIDs: {
				building: this.props.building.id
			}
		}];
	}
	getVariables() {
		return {
			id: this.props.building.id,
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




