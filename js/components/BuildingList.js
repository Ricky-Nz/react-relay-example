import React from 'react';
import Relay from 'react-relay';

class BuildingList extends React.Component {
	render() {
		console.log(this.props);
		return (
			<div>
				LIST
			</div>
		);
	}
}

export default Relay.createContainer(BuildingList, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				id,
				name,
				buildings(first: 10) {
					edges {
						node {
							id,
							title
						}
					}
				}
			}
		`
	}
});