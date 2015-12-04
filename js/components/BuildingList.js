import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { Row, Col, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import _ from 'underscore';

class BuildingList extends React.Component {
	render() {
		const buildingItems = this.props.user.buildings.edges.map(({node}, index) => {
			return (
				<ListGroupItem key={index} href={`#/console?username=${this.props.user.name}&select=${node.id}`}>
					{node.name}
				</ListGroupItem>
			);
		});

		return (
			<div>
				<Button><Link to={`/console?username=${this.props.user.name}`}>New</Link></Button>
				<ListGroup>
					{buildingItems}
				</ListGroup>
			</div>
		);
	}
}

export default Relay.createContainer(BuildingList, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				name,
				buildings(first: 10) {
					edges {
						node {
							id,
							name
						}
					}
				}
			}
		`
	}
});