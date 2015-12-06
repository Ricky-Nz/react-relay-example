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
					name,
					index,
					category,
					label,
					promote,
					location,
					type,
					area,
					status,
					segments
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
			name: this.props.name,
			index: this.props.index,
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




