import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import ProjectGridItem from './ProjectGridItem';

class ProjectGrid extends React.Component {
	render() {
		const projects = this.props.app.projects;
		const contentStyle = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			flexWrap: 'wrap'
		};
		const gridItems = projects&&projects.edges.map(({node}, index) =>
			<ProjectGridItem key={index} project={node}
				onClick={this.props.onGridItemClick}/>);

		return (
			<div style={contentStyle}>
				{gridItems}
			</div>
		);
	}
}

ProjectGrid.propTypes = {
	onGridItemClick: PropTypes.func.isRequired
};

export default Relay.createContainer(ProjectGrid, {
	initialVariables: {
		filter: null
	},
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				projects(labels: $filter, first: 1000) {
					edges {
						node {
							${ProjectGridItem.getFragment('project')}
						}
					}
				}
			}
		`
	}
});