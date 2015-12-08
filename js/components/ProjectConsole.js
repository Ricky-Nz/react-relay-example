import React from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import { GnNavbar } from './elements';
import BuildingList from './BuildingList'
import BuildingEditor from './BuildingEditor';

class ProjectConsole extends React.Component {
	render() {console.log(this.props);
		const { user, building } = this.props.app;

		return (
			<Row>
				<Col xs={3} xsOffset={1}>
					<BuildingList user={user} select={this.props.location.query.select}/>
				</Col>
				<Col xs={7}>
					<BuildingEditor user={user} building={building||null}/>
				</Col>
			</Row>
		);
	}
}

export default Relay.createContainer(ProjectConsole, {
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