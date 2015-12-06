import React, { PropTypes } from 'react';
import { Carousel, CarouselItem } from 'react-bootstrap';

class GnImageCarousel extends React.Component {
	render() {
		const { imageUrls, width, height, ...carouselProps } = this.props;
		const carouselItems = imageUrls.map((imageUrl, index) => {
			const imageBackground = {
				width: width,
				height: height,
	  			background: `url(${imageUrl}) no-repeat`,
	  			backgroundSize: 'cover',
	  			backgroundPosition: 'center'
			};

			return (
				<CarouselItem key={index}>
					<div style={imageBackground}/>
				</CarouselItem>
			);
		});
		return (
			<Carousel {...carouselProps} controls={imageUrls&&imageUrls.length>1}>
				{carouselItems}
			</Carousel>
		);
	}
}

GnImageCarousel.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
	interval: PropTypes.number,
	defaultActiveIndex: PropTypes.number,
	indicators: PropTypes.bool
};

GnImageCarousel.defaultProps = {
	interval: 600000,
	defaultActiveIndex: 0,
	indicators: false
};

export default GnImageCarousel;