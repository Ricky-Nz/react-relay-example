import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { Row, Col, ListGroup, ListGroupItem, Button, Glyphicon } from 'react-bootstrap';
import _ from 'underscore';

class BuildingList extends React.Component {
	render() {
		const centerItem = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center'
		};
		const buildingItems = this.props.user.buildings.edges.map(({node}, index) => {
			return (
				<ListGroupItem key={index} href={`#/console?username=${this.props.user.name}&select=${node.id}`}>
					{node.name}
				</ListGroupItem>
			);
		});

		return (
			<div>
				<ListGroup>
					<ListGroupItem href={`#/console?username=${this.props.user.name}`}>
						<div style={centerItem}><Glyphicon glyph='plus'/>New</div>
					</ListGroupItem>
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
				buildings(first: 1000) {
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