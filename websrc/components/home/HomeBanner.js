import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { GnImageCarousel } from './elements';

class HomeBanner extends React.Component {
	render() {
		const topItem = {
			marginTop: 50,
			zIndex: 3,
			WebkitBoxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)',
			MozBoxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)',
			boxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)'
		};
		const banners = this.props.app.promotes
			&&this.props.app.promotes.edges.map(edge => edge.node.banner);

		return (
			<GnImageCarousel style={topItem} height={400}
				imageUrls={banners} interval={4000} indicators
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