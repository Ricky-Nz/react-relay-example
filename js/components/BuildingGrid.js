import React from 'react';
import Relay from 'react-relay';
import BuildingGridItem from './BuildingGridItem';

class BuildingGrid extends React.Component {
	render() {
		const contentStyle = {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap'
		};
		const gridItems = this.props.user.buildings.edges.map(({node}, index) => (
			<BuildingGridItem key={index} building={node}/>
		));

		return (
			<div style={contentStyle}>
				{gridItems}
			</div>
		);
	}
}

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

