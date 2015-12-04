import React from 'react';
import Relay from 'react-relay';

class BuildingGridItem extends React.Component {
	render() {
		const {thumbnail, name, index, location} = this.props.building;
		const itemStyle = {
			width: 80,
			height: 80,
  			background: `url(${thumbnail}) no-repeat`,
  			backgroundSize: 'cover',
  			backgroundPosition: 'center',
  			color: 'white'
		};

		return (
			<div style={itemStyle}>
				<div>
					{index}
				</div>
			</div>
		);
	}
}

export default Relay.createContainer(BuildingGridItem, {
	fragments: {
		building: () => Relay.QL`
			fragment on Building {
				id,
				name,
				index,
				location,
				thumbnail
			}
		`
	}
});