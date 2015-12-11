import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { GnImageCarousel, GnParallaxImage } from './elements';

class SegmentImages extends React.Component {
	render() {
		const { segment, height } = this.props;
		if (segment.mode === 'FILL') {
			return (
				<GnParallaxImage imageUrl={segment.images[0]} height={height}/>
			);
		} else {
			return (
				<GnImageCarousel imageUrls={segment.images} height={height}/>
			);
		}
	}
}

SegmentImages.propTypes = {
	height: PropTypes.number
};

export default Relay.createContainer(SegmentImages, {
	fragments: {
		segment: () => Relay.QL`
			fragment on Segment {
				mode,
				images
			}
		`
	}
});