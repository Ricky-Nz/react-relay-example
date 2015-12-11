import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Button, Input } from 'react-bootstrap';
import { GnTags } from './elements';
import { UpdateUserMutation } from '../mutations';

class ConfigureConsole extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.onPropsChange(props);
	}
	componentWillReceiveProps(nextProps) {
		this.setState(this.onPropsChange(nextProps));
	}
	render() {
		const { categories, labels, projectTypes } = this.props.app.user;
		return (
			<Row>
				<Col xs={10} xsOffset={1} sm={6} smOffset={3}>
					<Input type='number' label='Home Banner Slot Count'
						value={this.state.bannerCount} onChange={this.onInputChange.bind(this, 'bannerCount')}/>
					<GnTags ref='category' tags={categories} label='Categories' placeholder='new category'/>
					<GnTags ref='label' tags={labels} label='Labels' placeholder='new label'/>
					<GnTags ref='types' tags={projectTypes} label='Project Types' placeholder='new type'/>
				</Col>
				<Col xs={10} xsOffset={1} sm={6} smOffset={3}>
					<br/><br/>
					<Input ref='password' type='password' label='Submit' placeholder='password'
						buttonAfter={<Button bsStyle='primary' onClick={this.onUpdateUser.bind(this)}>Update</Button>}/>
				</Col>
			</Row>
		);
	}
	onPropsChange(props) {
		return {
			bannerCount: props.app.user.bannerCount
		};
	}
	onInputChange(fieldName, e) {
		this.setState({[fieldName]: e.target.value});
	}
	onUpdateUser() {
		Relay.Store.update(new UpdateUserMutation({
			password: this.refs.password.refs.input.value,
			user: this.props.app.user,
			bannerCount: this.state.bannerCount,
			categories: this.refs.category.getTags(),
			labels: this.refs.label.getTags(),
			projectTypes: this.refs.types.getTags()
		}));
	}
}

export default Relay.createContainer(ConfigureConsole, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				user {
					bannerCount,
					categories,
					labels,
					projectTypes,
					${UpdateUserMutation.getFragment('user')}
				}
			}
		`
	}
});