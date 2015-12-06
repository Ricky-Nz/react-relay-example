import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Button } from 'react-bootstrap';
import { GnTags } from './elements';
import { UpdateUserMutation } from '../mutations';

class ConfigureConsole extends React.Component {
	render() {
		const { categories, labels } = this.props.app.user;
		return (
			<Row>
				<Col xs={10} xsOffset={1} sm={8} smOffset={2}>
					<GnTags ref='category' tags={categories} label='Categories' placeholder='new category'/>
					<GnTags ref='label' tags={labels} label='Labels' placeholder='new label'/>
				</Col>
				<Col xs={10} xsOffset={1} sm={8} smOffset={2}>
					<Button bsStyle='primary' onClick={this.onUpdateUser.bind(this)}>Submit</Button>
				</Col>
			</Row>
		);
	}
	onUpdateUser() {
		Relay.Store.update(new UpdateUserMutation({
			user: this.props.app.user,
			categories: this.refs.category.getTags(),
			labels: this.refs.label.getTags()
		}));
	}
}

export default Relay.createContainer(ConfigureConsole, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				user {
					categories,
					labels,
					${UpdateUserMutation.getFragment('user')}
				}
			}
		`
	}
});