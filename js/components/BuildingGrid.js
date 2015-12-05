import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import BuildingGridItem from './BuildingGridItem';

class BuildingGrid extends React.Component {
	render() {
		const contentStyle = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			flexWrap: 'wrap'
		};
		const gridItems = this.props.user.buildings.edges.map(({node}, index) => (
			<BuildingGridItem key={index} building={node} onItemClick={this.props.onItemClick}/>
		));

		return (
			<div style={contentStyle}>
				{gridItems}
			</div>
		);
	}
}

BuildingGrid.propTypes = {
	onItemClick: PropTypes.func
};

export default Relay.createContainer(BuildingGrid, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				buildings(first: 1000) {
					edges {
						node {
							${BuildingGridItem.getFragment('building')}
						}
					}
				}
			}
		`
	}
});

