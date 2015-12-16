import Relay from 'react-relay';

export default class UpdateProjectMutation extends Relay.Mutation {
	static fragments = {
		project: () => Relay.QL`
			fragment on Project {
				id
			}
		`
	};
	getMutation() {
		return Relay.QL`mutation{updateProject}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on UpdateProjectPayload {
				project {
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
				project: this.props.project.id
			}
		}];
	}
	getVariables() {
		return {
			password: this.props.password,
			id: this.props.project.id,
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




