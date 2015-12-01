import React from 'react';
import Relay from 'react-relay';
import {Input, Button, Row, Col, Label, ListGroup, ListGroupItem } from 'react-bootstrap';
import {GnSelectableTags} from './elements';
import Dropzone from 'react-dropzone';
import { CreateBuildingMutation, UpdateBuildingMutation, RemoveBuildingMutation } from '../mutations';
import _ from 'underscore';

class BuildingEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newTag: '',
			labels: []
		};
	}
	_onFileSelect(files) {
		this.setState({
			file: files[0]
		});
	}
	_onTagInputChange(e) {
		this.setState({
			newTag: e.target.value
		});
	}
	_onTitleChange(e) {
		this.setState({
			title: e.target.value
		});
	}
	_onIndexChange(e) {
		this.setState({
			index: e.target.value
		});
	}
	_onDescriptionChange(e) {
		this.setState({
			description: e.target.value
		});
	}
	_onAddNewTag() {
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
				title: this.state.title,
				index: this.state.index,
				description: this.state.description,
				labels: this.refs.tags.getSelection(),
				file: this.state.file||null
			}));
		} else {
			Relay.Store.update(new CreateBuildingMutation({
				userId: this.props.user.id,
				title: this.state.title,
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
				title: node.title,
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
				title: '',
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
					{node.title}
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
					<Input type='text' placeholder='building title'
						label='Title' value={this.state.title} onChange={this._onTitleChange.bind(this)}/>
					<Input type='text' placeholder='building index'
						label='Index' value={this.state.index} onChange={this._onIndexChange.bind(this)}/>
					<Input type='textarea' placeholder='building description'
						label='Description' value={this.state.description} onChange={this._onDescriptionChange.bind(this)}/>
					<Row>
						<Col xs={6}>
							<Input type='text' placeholder='tag name' label='New Tag' value={this.state.newTag}
								onChange={this._onTagInputChange.bind(this)} buttonAfter={<Button onClick={this._onAddNewTag.bind(this)}>Add</Button>}/>
						</Col>
					</Row>
					<GnSelectableTags ref='tags' labels={this.state.labels}/>
					<div style={bottombar}>
						<Dropzone onDrop={this._onFileSelect.bind(this)}>
							<div style={content}>
								{this.state.file?<img style={image} src={this.state.file.preview}/>
									:<p style={hint}>Drop file here or click to select.</p>}
							</div>
						</Dropzone>
						<div>
							{this.state.selectBuilding&&<Button bsStyle='danger' onClick={this._onDelete.bind(this)}>Delete</Button>}
							<Button bsStyle='primary' onClick={this._onSubmit.bind(this)}>Submit</Button>
						</div>
					</div>
				</Col>
			</Row>
		);
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
							title,
							index,
							description,
							thumbnail,
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




