import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Pager, PageItem } from 'react-bootstrap';
import _ from 'underscore';

class ProjectPager extends React.Component {
	render() {
		const projects = this.props.app.buildings;
		const index = projects&&_.findIndex(projects.edges,
			({node}) => node.id === this.props.currentId);
		const previousItem = projects&&projects.edges[index-1];
		const nextItem = projects&&projects.edges[index+1];

		return (
			<Pager>
				<PageItem href={`/project/${previousItem&&previousItem.node.id}`} disabled={!previousItem}>Previous</PageItem>
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<PageItem href={`/project/${nextItem&&nextItem.node.id}`} disabled={!nextItem}>Next</PageItem>
			</Pager>
		);
	}
}

ProjectPager.propTypes = {
	currentId: PropTypes.string.isRequired
};

export default Relay.createContainer(ProjectPager, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				buildings(first: 1000) {
					edges {
						node {
							id
						}
					}
				}
			}
		`
	}
})