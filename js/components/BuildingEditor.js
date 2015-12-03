import React from 'react';
import Relay from 'react-relay';
import { Input, Button, Row, Col } from 'react-bootstrap';
import { GnSelectableTags } from './elements';
import { CreateBuildingMutation, UpdateBuildingMutation, RemoveBuildingMutation } from '../mutations';
import _ from 'underscore';

class BuildingEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		this._onRefreshEditor(this.props);
	}
	componentWillReceiveProps(nextProps) {
		this._onRefreshEditor(nextProps);
	}
	render() {
		const bottombar = {
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'space-between'
		};
		const editFields = [
			{name: 'Name', type: 'text'},
			{name: 'Index', type: 'text'},
			{name: 'Location', type: 'text'},
			{name: 'Type', type: 'text'},
			{name: 'Area', type: 'text'},
			{name: 'Status', type: 'text'},
			{name: 'Banner', type: 'file'},
			{name: 'Thumbnail', type: 'file'}
		];
		const editFieldViews = editFields.map((field, index) => {
			const lowerCase = field.name.toLowerCase();
			return (
				<Input key={index} type={field.type} placeholder={`building ${lowerCase}`}
					label={field.name} value={field.type == 'text' ? this.state[lowerCase] : undefined} onChange={this._onInputChanged.bind(this, lowerCase)}/>
			);
		});

		return (
			<div>
				{editFieldViews}
				<GnSelectableTags ref='tags' labels={this.state.labels||[]}/>
				<Row>
					<Col xs={6}>
						<Input type='text' placeholder='tag name' label='New Tag' value={this.state.newTag}
							onChange={this._onInputChanged.bind(this, 'newTag')} buttonAfter={<Button onClick={this._onNewTag.bind(this)}>Add</Button>}/>
					</Col>
				</Row>
				<div style={bottombar}>
					<div>
						{this.props.building&&<Button bsStyle='danger' onClick={this._onDelete.bind(this)}>Delete</Button>}
						<Button bsStyle='primary' onClick={this._onSubmit.bind(this)}>Submit</Button>
					</div>
				</div>
			</div>
		);
	}
	_onRefreshEditor(props) {
		if (props.building) {
			this.setState({
				name: props.building.name,
				index: props.building.index,
				location: props.building.location,
				type: props.building.type,
				area: props.building.area,
				status: props.building.status,
				banner: props.building.banner,
				thumbnail: props.building.thumbnail,
				labels: props.building.labels,
				segments: props.building.segments
			});
		} else {
			this.setState({
				name: '',
				index: '',
				location: '',
				type: '',
				area: '',
				status: '',
				banner: '',
				thumbnail: '',
				labels: [],
				segments: []
			});
		}
	}
	_onInputChanged(fieldName, e) {
		this.setState({
			[fieldName]: e.target.files[0]||e.target.value
		})
	}
	_onNewTag() {
		if (this.state.labels.indexOf(this.state.newTag) < 0) {
			this.setState({
				labels: [...this.state.labels, this.state.newTag],
				newTag: ''
			});
		} else {
			this.setState({
				newTag: ''
			});
		}
	}
	_onSubmit() {
		var fields = {
			name: this.state.name,
			index: this.state.index,
			location: this.state.location,
			type: this.state.type,
			area: this.state.area,
			status: this.state.status,
			labels: this.state.labels,
			segments: this.state.segments,
			fileMap: {}
		};
		if (this.state.banner) {
			fields.fileMap.banner = this.state.banner
		}
		if (this.state.thumbnail) {
			fields.fileMap.thumbnail = this.state.thumbnail
		}

		if (this.props.building) {
			Relay.Store.update(new UpdateBuildingMutation({
				building: this.props.building, ...fields
			}));
		} else {
			Relay.Store.update(new CreateBuildingMutation({
				userId: this.props.user.id, ...fields
			}));
		}
	}
	_onDelete() {
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
				id,
				${CreateBuildingMutation.getFragment('user')},
				${RemoveBuildingMutation.getFragment('user')},
			}
		`,
		building: () => Relay.QL`
			fragment on Building {
				id,
				name,
				index,
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




