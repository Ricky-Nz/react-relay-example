import React from 'react';
import Relay from 'react-relay';
import {Input, Button, Row, Col, Label, ListGroup, ListGroupItem } from 'react-bootstrap';
import {GnSelectableTags} from './elements';
import Dropzone from 'react-dropzone';
import { CreateBuildingMutation, UpdateBuildingMutation, RemoveBuildingMutation } from '../mutations';
import _ from 'underscore';

class BuildingEditor extends React.Component {
	componentDidMount() {
		this._onPropsChanges(this.props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.location.query.select !== this.props.location.query.select) {
			this._onPropsChanges(nextProps);
		}
	}
	render() {
		const content = {
			width: '100%',
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			padding: 4
		};
		const hint = {
			textAlign: 'center'
		};
		const image = {
			width: '100%'
		};
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

		return (
			<Row>
				<Col sm={4} smOffset={1} md={3} mdOffset={2}>
					<ListGroup>
						{buildingItems}
					</ListGroup>
				</Col>
				<Col sm={6} md={5}>
					<Input type='text' placeholder='building name'
						label='Name' value={this.state.name} onChange={this._onInputChanged.bind(this, 'name')}/>
					<Input type='text' placeholder='building index'
						label='Index' value={this.state.index} onChange={this._onInputChanged.bind(this, 'index')}/>
					<Input type='text' placeholder='building location'
						label='Location' value={this.state.location} onChange={this._onInputChanged.bind(this, 'location')}/>
					<Input type='text' placeholder='building type'
						label='Type' value={this.state.type} onChange={this._onInputChanged.bind(this, 'type')}/>
					<Input type='text' placeholder='building area'
						label='Area' value={this.state.area} onChange={this._onInputChanged.bind(this, 'area')}/>
					<Input type='text' placeholder='building status'
						label='Status' value={this.state.status} onChange={this._onInputChanged.bind(this, 'status')}/>
					<Input type='file'
						label='Banner' onChange={this._onInputChanged.bind(this, 'banner')}/>
					<Input type='file'
						label='Thumbnail' onChange={this._onInputChanged.bind(this, 'thumbnail')}/>
					<GnSelectableTags ref='tags' labels={this.state.labels}/>
					<Row>
						<Col xs={6}>
							<Input type='text' placeholder='tag name' label='New Tag' value={this.state.newTag}
								onChange={this._onInputChanged.bind(this, 'newTag')} buttonAfter={<Button onClick={this._onNewTag.bind(this)}>Add</Button>}/>
						</Col>
					</Row>
					<div style={bottombar}>
						<div>
							{this.state.selectBuilding&&<Button bsStyle='danger' onClick={this._onDelete.bind(this)}>Delete</Button>}
							<Button bsStyle='primary' onClick={this._onSubmit.bind(this)}>Submit</Button>
						</div>
					</div>
				</Col>
			</Row>
		);
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
				building: this.state.selectBuilding,
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
	_onPropsChanges(props) {
		const selectUser = props.location.query.select
			&&_.find(props.user.buildings.edges, ({node}) => node.id === props.location.query.select);
		if (selectUser) {
			const node = selectUser.node;
			this.setState({
				selectBuilding: node,
				name: node.name,
				index: node.index,
				description: node.description,
				thumbnail: node.thumbnail,
				file: null,
				labels: node.labels,
				newTag: ''
			});
		} else {
			this.setState({
				selectBuilding: null,
				name: '',
				index: '',
				description: '',
				thumbnail: '',
				file: null,
				labels: [],
				newTag: ''
			});
		}
	}
	_onDelete() {
		Relay.Store.update(new RemoveBuildingMutation({
			building: this.state.selectBuilding,
			user: this.props.user
		}));
	}
}

export default Relay.createContainer(BuildingEditor, {
	fragments: {
		user: () => Relay.QL`
			fragment on User {
				id,
				buildings(first: 10) {
					edges {
						node {
							id,
							name,
							index,
							labels,
							${RemoveBuildingMutation.getFragment('building')}
							${UpdateBuildingMutation.getFragment('building')}
						}
					}
				},
				${CreateBuildingMutation.getFragment('user')},
				${RemoveBuildingMutation.getFragment('user')},
			}
		`
	}
});




