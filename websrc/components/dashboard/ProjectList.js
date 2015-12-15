import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';
import ProjectListItem from './ProjectListItem';

class ProjectList extends React.Component {
	render() {
		const buildingItems = this.props.app.buildings.edges.map(({node}, index) =>
			<ProjectListItem key={index} select={this.props.select} building={node}/>);

		return (
			<div>
				<ListGroup>
					<ListGroupItem href={'/console/project'}>
						<div style={{display: 'felx', flexDirection: 'row', justifyContent: 'center'}}>
							<Glyphicon glyph='plus'/>
							New
						</div>
					</ListGroupItem>
					{buildingItems}
				</ListGroup>
			</div>
		);
	}
}

ProjectList.propTypes = {
	select: PropTypes.string
};

export default Relay.createContainer(ProjectList, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				buildings(first: 1000) {
					edges {
						node {
							${ProjectListItem.getFragment('building')}
						}
					}
				}
			}
		`
	}
});