import React from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import ProjectList from './ProjectList'
import ProjectEditor from './ProjectEditor';

class DashboardProject extends React.Component {
	render() {
		return (
			<Row>
				<Col xs={3} xsOffset={1}>
					<ProjectList app={this.props.app} select={this.props.location.query.select}/>
				</Col>
				<Col xs={7}>
					<ProjectEditor app={this.props.app} building={this.props.app.building||null}/>
				</Col>
			</Row>
		)
	}
}

export default Relay.createContainer(DashboardProject, {
	initialVariables: {
		select: null,
		fetchBuilding: true
	},
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				${ProjectList.getFragment('app')},
				${ProjectEditor.getFragment('app')},
				building(id: $select) @include(if: $fetchBuilding) {
					${ProjectEditor.getFragment('building')}
				}
			}
		`
	}
});