import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Button, Input } from 'react-bootstrap';
import { LabelEditor, GnAlert } from './elements';
import { UpdateAppMutation } from '../../mutations';

class DashboardConfigTab extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.onPropsChange(props);
	}
	componentWillReceiveProps(nextProps) {
		this.setState(this.onPropsChange(nextProps));
	}
	render() {
		const { bannerCount, categories, labels, projectTypes } = this.state;
		return (
			<Row>
				<Col xs={5} xsOffset={1} sm={3} smOffset={3}>
					<Input type='number' label='Home Banner Slot Count' value={bannerCount}
						onChange={e => this.setState({bannerCount: e.target.value})}/>
				</Col>
				<Col xs={10} xsOffset={1} sm={6} smOffset={3}>
					<LabelEditor labels={categories} title='Categories' placeholder='new category'
						onLabelChange={newValues => this.setState({categories: newValues})}/>
					<LabelEditor labels={labels} title='Labels' placeholder='new label'
						onLabelChange={newValues => this.setState({labels: newValues})}/>
					<LabelEditor labels={projectTypes} title='Project Types' placeholder='new type'
						onLabelChange={newValues => this.setState({projectTypes: newValues})}/>
				</Col>
				<Col xs={8} xsOffset={2} sm={4} smOffset={4}>
					<br/><br/>
					<Input ref='password' type='password' label='Submit' placeholder='password'
						buttonAfter={<Button bsStyle='primary' onClick={this.onSubmit.bind(this)}>Update</Button>}/>
					<GnAlert ref='alert'/>
				</Col>
			</Row>
		);
	}
	onPropsChange({app}) {
		return {
			bannerCount: app.bannerCount,
			categories: app.categories,
			labels: app.labels,
			projectTypes: app.projectTypes
		};
	}
	onSubmit() {
		Relay.Store.update(new UpdateAppMutation(
			Object.assign({}, this.state, {
				password: this.refs.password.refs.input.value,
				app: this.props.app,
			})), {
			onFailure: this.onMutationFailure.bind(this),
			onSuccess: this.onMutationSuccess.bind(this)
		});
		this.refs.alert.start();
	}
	onMutationSuccess(response) {
		this.refs.alert.finish(true);
	}
	onMutationFailure(error) {
		this.refs.alert.finish(false);
	}
}

export default Relay.createContainer(DashboardConfigTab, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				bannerCount,
				categories,
				labels,
				projectTypes,
				${UpdateAppMutation.getFragment('app')}
			}
		`
	}
});