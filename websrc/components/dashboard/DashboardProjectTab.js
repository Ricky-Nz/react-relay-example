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
					<ProjectList app={this.props.app} select={this.props.params.id}/>
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
		id: null
	},
	prepareVariables: (variables) => {
		return {
			...variables,
			fetchBuilding: variables.id ? true : false
		};
	},
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				${ProjectList.getFragment('app')},
				${ProjectEditor.getFragment('app')},
				building(id: $id) @include(if: $fetchBuilding) {
					${ProjectEditor.getFragment('building')}
				}
			}
		`
	}
});