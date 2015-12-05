import React, { PropTypes } from 'react';
import { Image, Input, Button } from 'react-bootstrap';
import _ from 'underscore';

class GnImageInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.onPropChanged(props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.imageUrl != this.props.imageUrl) {
			this.setState(this.onPropChanged(nextProps));
		}
	}
	render() {
		const { label, multiple, previewWidth, previewHeight } = this.props;
		const imageContent = {
			position: 'relative',
			margin: 8
		};
		const imageStyle = {
			maxHeight: previewHeight,
			maxWidth: previewWidth
		};
		const deleteLabel = {
			position: 'absolute',
			right: 4,
			top: 4
		};
		const previewContent = {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap'
		};
		const imagePreviews = this.state.images.map((image, index) => {
			console.log(typeof image);
			const preview = (typeof image === 'string' ? image : URL.createObjectURL(image));
			return (
				<div key={index} style={imageContent} >
					<Image style={imageStyle} src={preview} responsive thumbnail/>
					<Button bsStyle='danger' bsSize='xsmall' style={deleteLabel}
						onClick={() => this.setState({images: [...this.state.images.slice(0, index), ...this.state.images.slice(index + 1)]})}>X</Button>
				</div>
			);
		});

		return (
			<div>
				<Input type='file' label={label} multiple={multiple} onChange={this.onFileSelect.bind(this)}/>
				<div style={previewContent}>{imagePreviews}</div>
			</div>
		);
	}
	onPropChanged(props) {
		if (props.imageUrl && typeof props.imageUrl === 'object') {
			return { images: [...props.imageUrl] };
		} else if (props.imageUrl && typeof props.imageUrl === 'string') {
			return { images: [props.imageUrl] };
		} else {
			return { images: [] };
		}
	}
	onFileSelect(e) {
		this.setState({ images: this.props.multiple ?
			[...this.state.images, ...e.target.files] : [e.target.files[0]] });
	}
	getImages() {
		return this.props.multiple ? this.state.images : this.state.images[0];
	}
}

GnImageInput.propTypes = {
	multiple: PropTypes.bool,
	label: PropTypes.string,
	previewHeight: PropTypes.number,
	previewWidth: PropTypes.number,
	imageUrl: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string)
	])
};

GnImageInput.defaultProps = {
	multiple: false,
	previewWidth: 150,
	previewHeight: 150
};

export default GnImageInput;


