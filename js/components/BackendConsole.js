import React from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import { GnNavbar } from './elements';
import BuildingList from './BuildingList'
import BuildingEditor from './BuildingEditor';

class BackendConsole extends React.Component {
	render() {
		const { user, building } = this.props.app;
		const contentStyle = {
			marginTop: 94
		};

		return (
			<div style={contentStyle}>
				<GnNavbar title='Arc studio Dashboard' fixedTop/>
				<Row>
					<Col xs={3} xsOffset={1}>
						<BuildingList user={user}/>
					</Col>
					<Col xs={7}>
						<BuildingEditor user={user} building={building||null}/>
					</Col>
				</Row>
			</div>
		);
	}
}

export default Relay.createContainer(BackendConsole, {
	initialVariables: {
		username: null,
		select: null,
		fetchBuilding: true
	},
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				user(name: $username) {
					${BuildingList.getFragment('user')},
					${BuildingEditor.getFragment('user')}
				},
				building(id: $select) @include(if: $fetchBuilding) {
					${BuildingEditor.getFragment('building')}
				}
			}
		`
	}
});