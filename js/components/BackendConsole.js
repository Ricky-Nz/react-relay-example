import React from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import BuildingEditor from './BuildingEditor';

class BackendConsole extends React.Component {
	render() {
		return (
			<Row>
				<Col xs={3} xsOffset={1}>
				</Col>
				<Col xs={7}>
					<BuildingEditor user={this.props.user}/>
				</Col>
			</Row>
		);
	}
}

export default Relay.createContainer(BackendConsole, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				${BuildingEditor.getFragment('user')}
			}
		`,
		building: () => Relay.QL`
			fragment on Building {
				${BuildingEditor.getFragment('building')}
			}
		`
	}
});