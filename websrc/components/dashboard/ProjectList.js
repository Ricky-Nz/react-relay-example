import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { ListGroup, ListGroupItem, Glyphicon } from 'react-bootstrap';
import DashboardProjectListItem from './DashboardProjectListItem';

class DashboardProjectList extends React.Component {
	render() {
		const buildingItems = this.props.app.buildings.edges.map(({node}, index) =>
			<DashboardProjectListItem key={index} select={this.props.select} building={node}/>);

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

DashboardProjectList.propTypes = {
	select: PropTypes.string
};

export default Relay.createContainer(DashboardProjectList, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				buildings(first: 1000) {
					edges {
						node {
							${DashboardProjectListItem.getFragment('building')}
						}
					}
				}
			}
		`
	}
});