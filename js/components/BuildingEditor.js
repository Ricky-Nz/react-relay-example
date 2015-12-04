import React from 'react';
import Relay from 'react-relay';
import Dropzone from 'react-dropzone';
import BuildingSegment from './BuildingSegment';
import { Input, Button, Row, Col, Image } from 'react-bootstrap';
import { GnSelectableTags, GnImageDropzone } from './elements';
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
		const bottombar = {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'space-between'
		};
		const textFields = [ 'Name', 'Index', 'Promote', 'Location', 'Type', 'Area', 'Status' ];
		const fileFields = [ 'Banner', 'Thumbnail' ];
		const textFieldViews = textFields.map((name, index) => {
			const lowerCaseName = name.toLowerCase();
			return (
				<Input key={index} type='text' placeholder={`building ${lowerCaseName}`}
					label={name} value={this.state[lowerCaseName]}
					onChange={this.onInputChanged.bind(this, lowerCaseName)}/>
			);
		});
		const fileFieldViews = fileFields.map((name, index) => {
			const lowerCaseName = name.toLowerCase();
			return (
				<GnImageDropzone key={index} ref={lowerCaseName}
					image={this.state[lowerCaseName]}/>
			);
		});
		const contentSegmentsViews = this.state.segments.map((segment, index) =>
			<BuildingSegment ref={`segment-${index}`} key={index} segment={segment}/>);

		return (
			<div>
				{textFieldViews}
				{fileFieldViews}
				{contentSegmentsViews}
				<Button onClick={this.onNewSegment.bind(this)}>New Segment</Button>
				<GnSelectableTags ref='tags' labels={this.state.labels||[]}/>
				<div style={bottombar}>
					<div>
						{this.props.building&&<Button bsStyle='danger' onClick={this.onDelete.bind(this)}>Delete</Button>}
						<Button bsStyle='primary' onClick={this.onSubmit.bind(this)}>Submit</Button>
					</div>
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
	onNewSegment() {
		this.setState({ segments: [...this.state.segments, {}]});
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
		const bannerFile = this.refs.banner.getImages();
		if (bannerFile&&bannerFile.preview) {
			fields.fileMap.banner = bannerFile;
		}
		const thumbnailFile = this.refs.thumbnail.getImages();
		if (thumbnailFile&&thumbnailFile.preview) {
			fields.fileMap.thumbnail = thumbnailFile;
		}
		this.state.segments.forEach((segment, index) => {
			let segmentData = this.refs[`segment-${index}`].getSegment();
			if (segmentData.images && segmentData.images[0].preview) {
				let files = segmentData.images;
				delete segmentData.images;
				if (files) {
					files.map((file, fileIndex) =>
						fields.fileMap[`segment-${index}-${fileIndex}`] = file);
				}
			}
			fields.segments.push(segmentData);
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




