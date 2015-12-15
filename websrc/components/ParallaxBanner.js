import React, { PropTypes } from 'react';
import sparkScroll from 'react-spark-scroll-rekapi';

const { SparkScroll, SparkProxy } = sparkScroll({invalidateAutomatically: true});

class ParallaxBanner extends React.Component {
	render() {
		const parallaxCont = Object.assign({
			position: 'relative',
			overflow: 'hidden',
			height: this.props.height
		}, this.props.style);
		const parallaxShadow = {
			position: 'absolute',
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			height: this.props.height,
			zIndex: 3,
			WebkitBoxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)',
			MozBoxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)',
			boxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)'
		};
		const parallaxImg = {
			backgroundImage: `url(${this.props.imageUrl})`,
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
	  		backgroundPosition: 'center',
			height: this.props.height + 100,
			position: 'absolute',
			width: '100%'
		};
		return (
			<SparkProxy.div proxyId='parallax' style={parallaxCont}>
				<div style={parallaxShadow}></div>
				<SparkScroll.div
					style={parallaxImg}
					proxy='parallax'
					timeline={{
					topBottom: {transform: 'translate3d(0px,0px,0px)'},
					bottomTop: {transform: 'translate3d(0px,-80px,0px)'}
				}}></SparkScroll.div>
			</SparkProxy.div>
		);
	}
}

ParallaxBanner.propTypes = {
	imageUrl: PropTypes.string.isRequired,
	height: PropTypes.number
};

export default ParallaxBanner;

