import React from 'react';
import Relay from 'react-relay';
import { Input, Button } from 'react-bootstrap';
import { GnSelectableTags } from './elements';
import { CreateBuildingMutation, UpdateBuildingMutation, RemoveBuildingMutation } from '../mutations';
import _ from 'underscore';

class BuildingEditor extends React.Component {
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
		const buildingItems = this.props.user.buildings.edges.map(({node}, index) => {
			return (
				<ListGroupItem key={index} href={`#/editor?select=${node.id}`}>
					{node.name}
				</ListGroupItem>
			);
		});
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
					label={field.name} value={this.state[lowerCase]} onChange={this._onInputChanged.bind(this, lowerCase)}/>
			);
		});

		return (
			<div>
				{editFieldViews}
				<GnSelectableTags ref='tags' labels={this.state.labels}/>
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
			[fieldName]: e.target.files||e.target.value
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
		if (this.state.selectBuilding) {
			Relay.Store.update(new UpdateBuildingMutation({
				building: this.props.building,
				name: this.state.name,
				index: this.state.index,
				description: this.state.description,
				labels: this.refs.tags.getSelection(),
				file: this.state.file||null
			}));
		} else {
			Relay.Store.update(new CreateBuildingMutation({
				userId: this.props.user.id,
				name: this.state.name,
				index: this.state.index,
				description: this.state.description,
				labels: this.refs.tags.getSelection(),
				file: this.state.file,
				user: this.props.user
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
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				${CreateBuildingMutation.getFragment('user')},
				${RemoveBuildingMutation.getFragment('user')},
			}
		`,
		building: (variables) => Relay.QL`
			fragment on Building {
				${UpdateBuildingMutation.getFragment('building').if(variables.selectId)}
			}
		`
	}
});




