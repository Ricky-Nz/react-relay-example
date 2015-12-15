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
					order,
					category,
					promote,
					location,
					type,
					area,
					status,
					banner,
					thumbnail,
					labels,
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
			password: this.props.password,
			id: this.props.building.id,
			name: this.props.name,
			index: this.props.index,
			order: this.props.order,
			category: this.props.category,
			promote: this.props.promote,
			location: this.props.location,
			type: this.props.type,
			area: this.props.area,
			status: this.props.status,
			thumbnail: this.props.thumbnail,
			banner: this.props.banner,
			labels: this.props.labels,
			segments: this.props.segments
		};
	}
	getFiles() {
		return this.props.fileMap;
	}
}




