import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Relay from 'react-relay';

class ProjectNamecard extends React.Component {
	render() {
		const project = this.props.project;
		const contentStyle = Object.assign({
			padding: '20px 30px',
			background: 'rgba(41, 182, 246, 0.75)',
			color: 'white'
		}, this.props.style);
		const titleFont = {
			fontSize: '2em'
		};
		return (
			<div style={contentStyle}>
				PROJECT NAME
				<div style={titleFont}>{`${project.index} | ${project.name}`}</div>
				<Row>
					<Col xs={6}>
						LOCATION
						<div>{project.location}</div>
					</Col>
					<Col xs={6}>
						TYPE
						<div>{project.type}</div>
					</Col>
				</Row>
				<Row>
					<Col xs={6}>
						AREA
						<div>{project.area}</div>
					</Col>
					<Col xs={6}>
						STATUS
						<div>{project.status}</div>
					</Col>
				</Row>
			</div>
		);
	}
}

export default Relay.createContainer(ProjectNamecard, {
	fragments: {
		project: () => Relay.QL`
			fragment on Project {
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