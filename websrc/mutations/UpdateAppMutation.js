import Relay from 'react-relay';

export default class UpdateAppMutation extends Relay.Mutation {
	static fragments = {
		app: () => Relay.QL`
			fragment on App {
				id
			}
		` 
	};
	getMutation() {
		return Relay.QL`mutation{updateApp}`;
	}
	getFatQuery() {
		return Relay.QL`
			fragment on UpdateAppPayload {
				app {
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
				app: this.props.app.id
			}
		}];
	}
	getVariables() {
		return {
			password: this.props.password,
			bannerCount: this.props.bannerCount,
			categories: this.props.categories,
			labels: this.props.labels,
			projectTypes: this.props.projectTypes
		};
	}
}