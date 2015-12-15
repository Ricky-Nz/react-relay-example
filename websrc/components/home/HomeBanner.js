import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { ImageCarousel } from '../';

class HomeBanner extends React.Component {
	render() {
		const { promotes } = this.props.app;
		const topItem = {
			marginTop: 50,
			zIndex: 3,
			WebkitBoxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)',
			MozBoxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)',
			boxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)'
		};
		const bannerImages = promotes&&promotes.edges.map(({node}) => node.banner);

		return (
			<ImageCarousel style={topItem} height={400}
				imageUrls={bannerImages} interval={4000} indicators
				onItemSelect={this.onItemClick.bind(this)}/>
		);
	}
	onItemClick(index) {
		this.props.onItemClick(this.props.app.promotes.edges[index].node.id);
	}
}

HomeBanner.propTypes = {
	onItemClick: PropTypes.func.isRequired
};

export default Relay.createContainer(HomeBanner, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				promotes(first: 10) {
					edges {
						node {
							id,
							banner
						}
					}
				}
			}
		`
	}
});