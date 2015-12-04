import React, { PropTypes } from 'react';
import { Input } from 'react-bootstrap';
import { GnImageDropzone } from './elements';

class BuildingSegment extends React.Component {
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
		return (
			<div>
				<Input type='text' placeholder='title' label='Title'
					value={this.state.title} onChange={this.onInputChange.bind(this, 'title')}/>
				<Input type='textarea' placeholder='content' label='Content'
					value={this.state.content} onChange={this.onInputChange.bind(this, 'content')}/>
				<Input type='text' placeholder='mode' label='Mode'
					value={this.state.mode} onChange={this.onInputChange.bind(this, 'mode')}/>
				<GnImageDropzone ref='files' image={this.props.segment.images} multiple/>
			</div>
		);
	}
	onPropsChange(props) {
		return {
			title: props.segment.title,
			content: props.segment.content,
			mode: props.segment.mode
		};
	}
	onInputChange(fileName, e) {
		this.setState({ [fileName]: e.target.value });
	}
	getSegment() {
		return Object.assign({},
			this.state, {images: this.refs.files.getImages()});
	}
}

BuildingSegment.propTypes = {
	segment: PropTypes.object.isRequired
};

export default BuildingSegment;



