import Relay from 'react-relay';

export default {
	user: () => Relay.QL`
		query {
			user(name: $username)
		}
	`,
	building: () => Relay.QL`
		query {
			building(id: $select)
		}
	`
};