import React from 'react';
import Relay from 'react-relay';
import BuildingSegment from './BuildingSegment';
import { Input, Button, Row, Col, Image, Panel } from 'react-bootstrap';
import { GnTags, GnImageInput, GnAlert } from './elements';
import { CreateBuildingMutation, UpdateBuildingMutation, RemoveBuildingMutation } from '../mutations';
import _ from 'underscore';

class BuildingEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.onPropChanged(props);
	}
	componentWillReceiveProps(nextProps) {
		this.setState(this.onPropChanged(nextProps));
	}
	render() {
		const flexEnd = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-end',
			alignItems: 'center'
		};
		const contentSegmentsViews = this.state.segments.map((segment, index) =>
			<BuildingSegment ref={`segment-${index}`} key={index} index={index}
				segment={segment} onInsert={this.onSegmentChange.bind(this, index, false)}
				onDelete={this.onSegmentChange.bind(this, index, true)}/>);
		const categoryViews = this.props.user.categories.map((category, index) =>
			<option key={index} value={category}>{category}</option>);
		const labelViews = this.props.user.labels.map((label, index) =>
			<option key={index} value={label}>{label}</option>);
		const projectTypeViews = this.props.user.projectTypes.map((type, index) =>
			<option key={index} value={type}>{type}</option>);
		const promoteSelectionViews = this.props.user.bannerCount>0&&_.range(this.props.user.bannerCount).map(index =>
			<option key={index} value={index+1}>{index+1}</option>);

		return (
			<div>
				<Panel header='Basic'>
					<Row>
						<Col xs={12}>
							<Input type='text' placeholder='name' label='Name' value={this.state.name}
								onChange={this.onInputChanged.bind(this, 'name')}/>
						</Col>
						<Col xs={6} md={4}>
							<Input type='select' label='Category' value={this.state.category}
								placeholder='select category' onChange={this.onInputChanged.bind(this, 'category')}>
								{categoryViews}
							</Input>
						</Col>
						<Col xs={6} md={4}>
							<Input type='select' label='Label' value={this.state.label}
								placeholder='select label' onChange={this.onInputChanged.bind(this, 'label')}>
								{labelViews}
							</Input>
						</Col>
						<Col xs={6} md={4}>
							<Input type='select' label='Put On Banner Slot' value={this.state.promote}
								placeholder='select slot position' onChange={this.onInputChanged.bind(this, 'promote')}>
								{promoteSelectionViews}
							</Input>
						</Col>
						<Col xs={12}>
							<Input type='textarea' placeholder='location' label='Location' value={this.state.location}
								onChange={this.onInputChanged.bind(this, 'location')}/>
						</Col>
						<Col xs={6} md={4}>
							<Input type='select' label='Project Type' value={this.state.type}
								placeholder='select type' onChange={this.onInputChanged.bind(this, 'type')}>
								{projectTypeViews}
							</Input>
						</Col>
						<Col xs={6} md={4}>
							<Input type='text' placeholder='area' label='Area' value={this.state.area}
								onChange={this.onInputChanged.bind(this, 'area')}/>
						</Col>
						<Col xs={6} md={4}>
							<Input type='text' placeholder='status' label='Status' value={this.state.status}
								onChange={this.onInputChanged.bind(this, 'status')}/>
						</Col>
						<Col xs={6} md={4}>
							<Input type='text' placeholder='order' label='Sort Order' value={this.state.order}
								onChange={this.onInputChanged.bind(this, 'order')}/>
						</Col>
						<Col xs={6} md={4}>
							<GnImageInput ref='banner' label='Banner' imageUrl={this.props.building&&this.props.building.banner}/>
						</Col>
						<Col xs={6} md={4}>
							<GnImageInput ref='thumbnail' label='Thumbnail' imageUrl={this.props.building&&this.props.building.thumbnail}/>
						</Col>
					</Row>
				</Panel>
				<Panel header='Details'>
					{contentSegmentsViews}
					<div style={flexEnd}>
						<Button bsSize='small' onClick={this.onSegmentChange.bind(this, -1, false)}>Add</Button>
					</div>
				</Panel>
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
	onPropChanged(props) {
		const building = props.building;
		return {
			name: building&&building.name||'',
			index: building&&building.index||'',
			order: building&&building.order||'',
			category: building&&building.category||'',
			label: building&&building.label||'',
			promote: building&&building.promote||'',
			location: building&&building.location||'',
			type: building&&building.type||'',
			area: building&&building.area||'',
			status: building&&building.status||'',
			segments: building&&building.segments||[]
		};
	}
	onInputChanged(fieldName, e) {
		this.setState({ [fieldName]: e.target.value });
	}
	onSegmentChange(index, del) {
		var newSegments;
		if (del) {
			newSegments = [...this.state.segments.slice(0, index), ...this.state.segments.slice(index + 1)];
		} else if (index >= 0) {
			newSegments = [...this.state.segments.slice(0, index), {}, ...this.state.segments.slice(index)];
		} else {
			newSegments = [...this.state.segments, {}];
		}
		this.setState({ segments: newSegments})
	}
	onSubmit() {
		var fields = {
			password: this.refs.password.refs.input.value,
			name: this.state.name,
			index: this.state.index,
			order: this.state.order,
			category: this.state.category,
			label: this.state.label,
			promote: this.state.promote,
			location: this.state.location,
			type: this.state.type,
			area: this.state.area,
			status: this.state.status,
			segments: [],
			fileMap: {}
		};
		const banner = this.refs.banner.getImages();
		if (typeof banner === 'object') {
			fields.fileMap.banner = banner;
		}
		const thumbnail = this.refs.thumbnail.getImages();
		if (typeof thumbnail === 'object') {
			fields.fileMap.thumbnail = thumbnail;
		}
		this.state.segments.forEach((data, index) => {
			let segment = this.refs[`segment-${index}`].getSegment();
			if (segment.images) {
				segment.images.forEach((image, imageIndex) => {
					if (typeof image === 'object') {
						fields.fileMap[`segment-${index}-${imageIndex}`] = image;
						segment.images[imageIndex] = '';
					}
				});
			}
			fields.segments.push(segment);
		});

		if (this.props.building) {
			Relay.Store.update(new UpdateBuildingMutation({
				building: this.props.building, ...fields
			}), {
				onFailure: this.onMutationFailure.bind(this),
				onSuccess: this.onMutationSuccess.bind(this)
			});
		} else {
			Relay.Store.update(new CreateBuildingMutation({
				user: this.props.user, ...fields
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
			user: this.props.user
		}), {
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

export default Relay.createContainer(BuildingEditor, {
	initialVariables: {
		selectId: false
	},
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				bannerCount,
				categories,
				labels,
				projectTypes,
				${CreateBuildingMutation.getFragment('user')},
				${RemoveBuildingMutation.getFragment('user')},
			}
		`,
		building: () => Relay.QL`
			fragment on Building {
				id,
				name,
				index,
				order,
				category,
				label,
				promote,
				location,
				type,
				area,
				status,
				banner,
				thumbnail,
				segments {
					title,
					content,
					images,
					mode
				},
				${UpdateBuildingMutation.getFragment('building')}
			}
		`
	}
});




