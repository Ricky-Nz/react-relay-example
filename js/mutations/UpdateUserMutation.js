import Relay from 'react-relay';

export default class UpdateUserMutation extends Relay.Mutation {
	static fragments = {
		user: () => Relay.QL`
			fragment on User {
				id,
				name
			}
		` 
	};
	getMutation() {
		return Relay.QL`mutation{updateUser}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on UpdateUserPayload {
				user {
					id,
					bannerCount,
					categories,
					labels,
					projectTypes
				}
			}
		`
	}
	getConfigs() {
		return [{
			type: 'FIELDS_CHANGE',
			fieldIDs: {
				user: this.props.user.id
			}
		}];
	}
	getVariables() {
		return {
			name: this.props.user.name,
			bannerCount: this.props.bannerCount,
			categories: this.props.categories,
			labels: this.props.labels,
			projectTypes: this.props.projectTypes
		};
	}
}