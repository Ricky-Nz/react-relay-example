import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';
import ProjectListItem from './ProjectListItem';

class ProjectList extends React.Component {
	render() {
		const projectItems = this.props.app.projects.edges.map(({node}, index) =>
			<ProjectListItem key={index} select={this.props.select} project={node}/>);

		return (
			<div>
				<ListGroup>
					<ListGroupItem href={'/console/project'}>
						<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
							<Glyphicon glyph='plus'/>
							New
						</div>
					</ListGroupItem>
					{projectItems}
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
				projects(first: 1000) {
					edges {
						node {
							${ProjectListItem.getFragment('project')}
						}
					}
				}
			}
		`
	}
});