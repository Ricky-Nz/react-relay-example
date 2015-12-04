import React from 'react';
import Relay from 'react-relay';
import { GnImageCarousel, GnNavbar } from './elements';
import BuildingGrid from './BuildingGrid';

class MainPage extends React.Component {
	render() {
		const banners = this.props.app.user.promotes.edges.map(edge => edge.node.banner);
		const topItem = {
			marginTop: 50,
			height: 300
		};

		return (
			<div>
				<GnNavbar title='Arc studio' fixedTop/>
				<GnImageCarousel style={topItem} imageUrls={banners}/>
				<BuildingGrid user={this.props.app.user}/>
			</div>
		);
	}
}

export default Relay.createContainer(MainPage, {
	initialVariables: {
		username: null
	},
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				user(name: $username) {
					${BuildingGrid.getFragment('user')},
					promotes(first: 6) {
						edges {
							node {
								id,
								name,
								banner
							}
						}
					}
				}
			}
		`
	}
});