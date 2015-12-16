import React, { PropTypes } from 'react';
import { Input, Row, Col, Label, Button, ButtonGroup } from 'react-bootstrap';
import { ImageInput } from '../';

class SegmentItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.onPropsChange(props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.segment !== this.props.segment) {
			this.setState(this.onPropsChange(nextProps));
		}
	}
	render() {
		const spaceBetween = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between'
		};

		return (
			<div>
				<div style={spaceBetween}>
					<p>
						<Label>{this.props.index + 1}</Label>
					</p>
					<ButtonGroup bsSize='small'>
						<Button bsSize='small' onClick={() => this.props.onInsert(this.props.index)}>Insert</Button>
						<Button bsSize='small' bsStyle='danger' onClick={() => this.props.onDelete(this.props.index)}>Delete</Button>
					</ButtonGroup>
				</div>
				{this.props.index!==0&&
					<Row>
						<Col xs={6} sm={2}>
							<Input type='select' label='Mode' value={this.state.mode} disabled={this.props.index===0}
								placeholder='select display mode' onChange={this.onInputChange.bind(this, 'mode')}>
								<option value='LEFT'>LEFT</option>
								<option value='RIGHT'>RIGHT</option>
								<option value='MIDDLE'>MIDDLE</option>
								<option value='FILL'>FILL</option>
							</Input>
						</Col>
						<Col xs={12} sm={10}>
							<ImageInput ref='images' label='Images' multiple={true} imageUrl={this.props.segment.images}/>
						</Col>
					</Row>
				}
				{this.state.mode!=='FILL'&&<Input type='text' placeholder='title' label='Title'
					value={this.state.title} onChange={this.onInputChange.bind(this, 'title')}/>}
				{this.state.mode!=='FILL'&&<Input type='textarea' placeholder='content' label='Content'
					value={this.state.content} onChange={this.onInputChange.bind(this, 'content')}/>}
			</div>
		);
	}
	onPropsChange(props) {
		return {
			title: props.segment.title||'',
			content: props.segment.content||'',
			mode: props.segment.mode||'LEFT'
		};
	}
	onInputChange(fileName, e) {
		this.setState({ [fileName]: e.target.value });
	}
	getSegment() {
		return Object.assign({},
			this.state, this.props.index!==0&&{images: this.refs.images.getImages()});
	}
}

SegmentItem.propTypes = {
	index: PropTypes.number,
	segment: PropTypes.object.isRequired,
	onDelete: PropTypes.func,
	onInsert: PropTypes.func
};

export default SegmentItem;



