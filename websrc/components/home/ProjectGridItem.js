import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';

class ProjectGridItem extends React.Component {
	render() {
		const {building, ...otherProps} = this.props;
		const itemStyle = {
			width: 180,
			height: 180,
			margin: 10,
			padding: 0,
  			background: `url(${building.thumbnail}) no-repeat`,
  			backgroundSize: 'cover',
  			backgroundPosition: 'center',
  			color: 'white'
		};
		const titleContent = {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			padding: '0px 10px 0px 0px',
			height: 44,
			background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7),  rgba(0, 0, 0, 0))'
		};
		const indexFont = {
			fontSize: '2em',
			padding: '0px 10px'
		};
		const textContent = {
			display: 'flex',
			flexDirection: 'row'
		};
		const nameFont = {
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis'
		};
		const locationFont = {
			fontSize: '0.7em',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis'
		};
		const underLine = {
			backgroundColor: 'white',
			height: 1,
			margin: '0px 10px'
		};
		const spliter = {
			backgroundColor: 'white',
			width: 1,
			height: 30,
			marginRight: 8
		};

		return (
			<ListGroupItem style={itemStyle} onClick={() => this.props.onClick(building)}>
				<div style={{height: 180, width: 180}}>
					<div style={titleContent}>
						<div style={indexFont}>{building.index}</div>
						<div style={spliter}></div>
						<div style={nameFont}>
							{building.name}
							<div style={locationFont} >{building.location}</div>
						</div>
					</div>
					<div style={underLine}></div>
				</div>
			</ListGroupItem>
		);
	}
}

export default Relay.createContainer(ProjectGridItem, {
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