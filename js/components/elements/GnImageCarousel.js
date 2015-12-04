import React, { PropTypes } from 'react';
import { Carousel, CarouselItem } from 'react-bootstrap';

class GnImageCarousel extends React.Component {
	render() {
		const { imageUrls, ...carouselProps } = this.props;
		const carouselItems = imageUrls.map((imageUrl, index) => {
			const test = {
				height: 300,
	  			background: `url(${imageUrl}) no-repeat`,
	  			backgroundSize: 'cover',
	  			backgroundPosition: 'center'
			};

			return (
				<CarouselItem key={index}>
					<div style={test}/>
					<div className="carousel-caption">
						<h3>First slide label</h3>
						<p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
					</div>
				</CarouselItem>
			);
		});
		return (
			<Carousel {...carouselProps}>
				{carouselItems}
			</Carousel>
		);
	}
}

GnImageCarousel.propTypes = {
	imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
	interval: PropTypes.number,
	defaultActiveIndex: PropTypes.number,
	indicators: PropTypes.bool,
	controls: PropTypes.bool
};

GnImageCarousel.defaultProps = {
	interval: 3000,
	defaultActiveIndex: 0,
	indicators: false,
	controls: false
};

export default GnImageCarousel;