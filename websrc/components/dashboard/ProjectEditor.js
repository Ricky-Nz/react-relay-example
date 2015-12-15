import React from 'react';
import Relay from 'react-relay';
import { Input, Button, Row, Col } from 'react-bootstrap';
import { GnAlert } from './elements';
import { CreateBuildingMutation, UpdateBuildingMutation, RemoveBuildingMutation } from '../mutations';
import ProjectBasicPanel from './ProjectBasicPanel';
import ProjectSegmentsPanel from './ProjectSegmentsPanel';

class ProjectEditor extends React.Component {
	render() {
		return (
			<div>
				<ProjectBasicPanel ref='basicEditor' app={this.props.app} building={this.props.building}/>
				<ProjectSegmentsPanel ref='segmentsEditor' building={this.props.building}/>
				<Row>
					<Col xs={12} sm={8} md={6} lg={5}>
						<Input ref='password' type='password' label='Submit' placeholder='password'
							buttonBefore={this.props.building&&<Button bsStyle='danger' onClick={this.onDelete.bind(this)}>Delete</Button>}
							buttonAfter={<Button bsStyle='primary' onClick={this.onSubmit.bind(this)}>{this.props.building?'Update':'Create'}</Button>}/>
						<GnAlert ref='alert'/>
					</Col>
				</Row>
			</div>
		);
	}
	onSubmit() {
		var project = Object.assign({fileMap: {}, segments: this.refs.segmentsEditor.refs.component.getSegments()},
			this.refs.basicEditor.refs.component.getBasicData());

		if (typeof project.banner === 'object') {
			project.fileMap.banner = project.banner;
			project.banner = '';
		}
		if (typeof project.thumbnail === 'object') {
			project.fileMap.thumbnail = project.thumbnail;
			project.thumbnail = '';
		}
		project.segments.forEach((segment, index) => {
			segment.images&&segment.images.forEach((image, imageIndex) => {
				if (typeof image === 'object') {
					project.fileMap[`segment-${index}-${imageIndex}`] = image;
					segment.images[imageIndex] = '';
				}
			});
		});

		if (this.props.building) {
			Relay.Store.update(new UpdateBuildingMutation({
				password: this.refs.password.refs.input.value,
				building: this.props.building,
				...project
			}), {
				onFailure: this.onMutationFailure.bind(this),
				onSuccess: this.onMutationSuccess.bind(this)
			});
		} else {
			Relay.Store.update(new CreateBuildingMutation({
				password: this.refs.password.refs.input.value,
				app: this.props.app,
				...project
			}), {
				onFailure: this.onMutationFailure.bind(this),
				onSuccess: this.onMutationSuccess.bind(this)
			});
		}
		this.refs.alert.start();
	}
	onDelete() {
		Relay.Store.update(new RemoveBuildingMutation({
			building: this.props.building,
			password: this.refs.password.refs.input.value,
			app: this.props.app
		}), {
			onFailure: this.onMutationFailure.bind(this),
			onSuccess: this.onDeleteSuccess.bind(this)
		});
		this.refs.alert.start();
	}
	onDeleteSuccess(response) {
		this.refs.alert.finish(true);
		window.location.replace('/console/project');
	}
	onMutationSuccess(response) {
		this.refs.alert.finish(true);
	}
	onMutationFailure(error) {
		this.refs.alert.finish(false);
	}
}

export default Relay.createContainer(ProjectEditor, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				id,
				${ProjectBasicPanel.getFragment('app')},
				${CreateBuildingMutation.getFragment('app')},
				${RemoveBuildingMutation.getFragment('app')}
			}
		`,
		building: () => Relay.QL`
			fragment on Building {
				id,
				${ProjectBasicPanel.getFragment('building')},
				${ProjectSegmentsPanel.getFragment('building')},
				${UpdateBuildingMutation.getFragment('building')},
				${RemoveBuildingMutation.getFragment('building')}
			}
		`
	}
});




