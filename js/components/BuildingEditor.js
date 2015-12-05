import React from 'react';
import Relay from 'react-relay';
import Dropzone from 'react-dropzone';
import BuildingSegment from './BuildingSegment';
import { Input, Button, Row, Col, Image, Panel } from 'react-bootstrap';
import { GnSelectableTags, GnImageInput } from './elements';
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
			alignItems: 'flex-end'
		};
		const contentSegmentsViews = this.state.segments.map((segment, index) =>
			<BuildingSegment ref={`segment-${index}`} key={index} index={index}
				segment={segment} onInsert={this.onSegmentChange.bind(this, index, false)}
				onDelete={this.onSegmentChange.bind(this, index, true)}/>);

		return (
			<div>
				<Panel header='Basic'>
					<Input type='text' placeholder='name' label='Name' value={this.state.name}
						onChange={this.onInputChanged.bind(this, 'name')}/>
					<Row>
						<Col xs={6}>
							<Input type='text' placeholder='index' label='Index' value={this.state.index}
								onChange={this.onInputChanged.bind(this, 'index')}/>
						</Col>
						<Col xs={6}>
							<Input type='text' placeholder='promote order' label='Promote' value={this.state.promote}
								onChange={this.onInputChanged.bind(this, 'promote')}/>
						</Col>
					</Row>
					<Input type='textarea' placeholder='location' label='Location' value={this.state.location}
						onChange={this.onInputChanged.bind(this, 'location')}/>
					<Row>
						<Col xs={4}>
							<Input type='text' placeholder='type' label='Type' value={this.state.type}
								onChange={this.onInputChanged.bind(this, 'type')}/>
						</Col>
						<Col xs={4}>
							<Input type='text' placeholder='area' label='Area' value={this.state.area}
								onChange={this.onInputChanged.bind(this, 'area')}/>
						</Col>
						<Col xs={4}>
							<Input type='text' placeholder='status' label='Status' value={this.state.status}
								onChange={this.onInputChanged.bind(this, 'status')}/>
						</Col>
					</Row>
					<GnSelectableTags ref='tags' labels={this.state.labels||[]}/>
					<GnImageInput ref='banner' label='Banner' imageUrl={this.state.banner}/>
					<GnImageInput ref='thumbnail' label='Thumbnail' imageUrl={this.state.thumbnail}/>
				</Panel>
				<Panel header='Details'>
					{contentSegmentsViews}
					<div style={flexEnd}>
						<Button bsSize='small' onClick={this.onSegmentChange.bind(this, -1, false)}>Add</Button>
					</div>
				</Panel>
				<div style={flexEnd}>
					<p>
						{this.props.building&&<Button bsSize='small' bsStyle='danger' onClick={this.onDelete.bind(this)}>Delete</Button>}
						<Button bsSize='small' bsStyle='primary' onClick={this.onSubmit.bind(this)}>Submit</Button>
					</p>
				</div>
			</div>
		);
	}
	onPropChanged(props) {
		const building = props.building;
		return {
			name: building&&building.name||'',
			index: building&&building.index||'',
			promote: building&&building.promote||'',
			location: building&&building.location||'',
			type: building&&building.type||'',
			area: building&&building.area||'',
			status: building&&building.status||'',
			banner: building&&building.banner||null,
			thumbnail: building&&building.thumbnail||null,
			labels: building&&building.labels||[],
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
			name: this.state.name,
			index: this.state.index,
			promote: this.state.promote,
			location: this.state.location,
			type: this.state.type,
			area: this.state.area,
			status: this.state.status,
			labels: this.state.labels,
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
			}));
		} else {
			Relay.Store.update(new CreateBuildingMutation({
				user: this.props.user, ...fields
			}));
		}
	}
	onDelete() {
		Relay.Store.update(new RemoveBuildingMutation({
			building: this.props.building,
			user: this.props.user
		}));
	}
}

export default Relay.createContainer(BuildingEditor, {
	initialVariables: {
		selectId: false
	},
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				${CreateBuildingMutation.getFragment('user')},
				${RemoveBuildingMutation.getFragment('user')},
			}
		`,
		building: () => Relay.QL`
			fragment on Building {
				id,
				name,
				index,
				promote,
				location,
				type,
				area,
				status,
				banner,
				thumbnail,
				labels,
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




