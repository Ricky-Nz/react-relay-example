import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Button } from 'react-bootstrap';

class BuildingGridItem extends React.Component {
	render() {
		const {building, ...itemProps} = this.props;
		const itemStyle = {
			width: 180,
			height: 180,
			margin: '10px 0px',
  			background: `url(${building.thumbnail}) no-repeat`,
  			backgroundSize: 'cover',
  			backgroundPosition: 'center',
  			color: 'white'
		};
		const titleContent = {
			display: 'flex',
			flexDirection: 'row',
			height: 40,
			padding: 5,
			background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7),  rgba(0, 0, 0, 0))'
		};
		const indexFont = {
			fontSize: '2em'
		};

		return (
			<Button bsStyle='link' {...itemProps} onClick={() => this.props.onItemClick(this.props.building.id)}>
				<div style={itemStyle}>
					<div style={titleContent}>
						<div style={indexFont}>{building.index}</div>
						<div>
							<div>{building.name}</div>
							<div>{building.location}</div>
						</div>
					</div>
				</div>
			</Button>
		);
	}
}

BuildingGridItem.propTypes = {
	onItemClick: PropTypes.func
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