import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Input, Panel } from 'react-bootstrap';
import { LabelSelector, ImageInput } from '../';

class ProjectBasicEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.onPropChanged(props);
	}
	componentWillReceiveProps(nextProps) {
		this.setState(this.onPropChanged(nextProps));
	}
	render() {
		const app = this.props.app;
		const editBuilding = this.state;
		const categoryOptions = app.categories&&app.categories.map((category, index) =>
			<option key={index} value={category}>{category}</option>);
		const projectTypeOptions = app.projectTypes&&app.projectTypes.map((type, index) =>
			<option key={index} value={type}>{type}</option>);
		const promoteOptions = app.bannerCount>0&&_.range(this.props.app.bannerCount).map(index =>
			<option key={index} value={index+1}>{index+1}</option>);

		return(
			<Panel header='Basic'>
				<Row>
					<Col xs={12}>
						<Input type='text' placeholder='name' label='Name' value={editBuilding.name}
							onChange={this.onInputChanged.bind(this, 'name')}/>
					</Col>
					<Col xs={12}>
						<LabelSelector title='Labels' allLabels={app.labels} selectLabels={editBuilding.labels}
							onSelectChange={selects => this.setState({labels: selects})}/>
					</Col>
					<Col xs={6} md={4}>
						<Input type='text' placeholder='index' label='Index' value={editBuilding.index}
							onChange={this.onInputChanged.bind(this, 'index')}/>
					</Col>
					<Col xs={6} md={4}>
						<Input type='select' label='Category' value={editBuilding.category||'None'}
							placeholder='select category' onChange={this.onInputChanged.bind(this, 'category')}>
							<option value=''>None</option>
							{categoryOptions}
						</Input>
					</Col>
					<Col xs={6} md={4}>
						<Input type='select' label='Put On Banner Slot' value={editBuilding.promote}
							placeholder='select slot position' onChange={this.onInputChanged.bind(this, 'promote')}>
							<option value=''>None</option>
							{promoteOptions}
						</Input>
					</Col>
					<Col xs={12}>
						<Input type='textarea' placeholder='location' label='Location' value={editBuilding.location}
							onChange={this.onInputChanged.bind(this, 'location')}/>
					</Col>
					<Col xs={6} md={4}>
						<Input type='select' label='Project Type' value={editBuilding.type}
							placeholder='select type' onChange={this.onInputChanged.bind(this, 'type')}>
							<option value=''>None</option>
							{projectTypeOptions}
						</Input>
					</Col>
					<Col xs={6} md={4}>
						<Input type='text' placeholder='area' label='Area' value={editBuilding.area}
							onChange={this.onInputChanged.bind(this, 'area')}/>
					</Col>
					<Col xs={6} md={4}>
						<Input type='text' placeholder='status' label='Status' value={editBuilding.status}
							onChange={this.onInputChanged.bind(this, 'status')}/>
					</Col>
					<Col xs={6} md={4}>
						<Input type='text' placeholder='order' label='Sort Order' value={editBuilding.order}
							onChange={this.onInputChanged.bind(this, 'order')}/>
					</Col>
					<Col xs={6} md={4}>
						<ImageInput ref='banner' label='Banner' imageUrl={this.props.building&&this.props.building.banner}/>
					</Col>
					<Col xs={6} md={4}>
						<ImageInput ref='thumbnail' label='Thumbnail' imageUrl={this.props.building&&this.props.building.thumbnail}/>
					</Col>
				</Row>
			</Panel>
		);
	}
	onPropChanged(props) {
		return Object.assign({}, props.building);
	}
	onInputChanged(fieldName, e) {
		this.setState({ [fieldName]: e.target.value });
	}
	getBasicData() {
		return Object.assign({}, this.state, {
			banner: this.refs.banner.getImages(),
			thumbnail: this.refs.thumbnail.getImages()
		});
	}
}

export default Relay.createContainer(ProjectBasicEditor, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				bannerCount,
				categories,
				labels,
				projectTypes
			}
		`,	
		building: () => Relay.QL`
			fragment on Building {
				name,
				index,
				order,
				category,
				promote,
				location,
				type,
				area,
				status,
				banner,
				thumbnail,
				labels
			}
		`
	}
});



