import React, { PropTypes } from 'react';
import { Image } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import _ from 'underscore';

class GnImageDropzone extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.onPropChanged(props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.image != this.props.image) {
			this.setState(this.onPropChanged(nextProps));
		}
	}
	render() {
		const contentStyle = {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			border: '2px dashed #E0E0E0',
			borderRadius: 10,
			padding: 10
		};
		const imageContent = {
			maxHeight: 200,
			maxWidth: 200,
			margin: 8
		};
		const imageViews = this.state.images.map((image, index) => {
			return (
				<Image key={index} style={imageContent} src={image.preview||image} responsive thumbnail/>
			);
		});

		return (
			<Dropzone style={contentStyle} multiple={this.props.multiple} onDrop={this.onFileChange.bind(this)}>
				{imageViews}
			</Dropzone>
		);
	}
	onPropChanged(props) {
		if (props.image && typeof props.image === 'object') {
			return { images: [...props.image] };
		} else if (props.image && typeof props.image === 'string') {
			return { images: [props.image] };
		} else {
			return { images: [] };
		}
	}
	onFileChange(files) {
		this.setState({ images: files });
	}
	getImages() {
		return this.props.multiple ? this.state.images : this.state.images[0];
	}
}

GnImageDropzone.propTypes = {
	multiple: PropTypes.bool,
	image: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string)
	])
};

GnImageDropzone.defaultProps = {
	multiple: false
};

export default GnImageDropzone;


