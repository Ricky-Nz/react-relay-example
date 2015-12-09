import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Relay from 'react-relay';

class ProjectNamecard extends React.Component {
	render() {
		const building = this.props.building;
		const contentStyle = Object.assign({
			padding: '20px 30px',
			background: 'rgba(0, 128, 255, 0.5)',
			color: 'white'
		}, this.props.style);
		const titleFont = {
			fontSize: '2em'
		};
		return (
			<div style={contentStyle}>
				PROJECT NAME
				<div style={titleFont}>{`${building.index} | ${building.name}`}</div>
				<Row>
					<Col xs={6}>
						LOCATION
						<div>{building.location}</div>
					</Col>
					<Col xs={6}>
						TYPE
						<div>{building.type}</div>
					</Col>
				</Row>
				<Row>
					<Col xs={6}>
						AREA
						<div>{building.area}</div>
					</Col>
					<Col xs={6}>
						STATUS
						<div>{building.status}</div>
					</Col>
				</Row>
			</div>
		);
	}
}

export default Relay.createContainer(ProjectNamecard, {
	fragments: {
		building: () => Relay.QL`
			fragment on Building {
				name,
				index,
				location,
				type,
				area,
				status
			}
		`
	}
});