import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Panel } from 'react-bootstrap';
import { GnImageCarousel, GnNavbar } from './elements';
import BuildingGrid from './BuildingGrid';

class MainPage extends React.Component {
	render() {
		const banners = this.props.app.user.promotes.edges.map(edge => edge.node.banner);
		const topItem = {
			marginTop: 50
		};
		const footer = {
			margin: '80px 0px 0px 0px',
			paddingTop: 0
		};
		const footerBackground = {
			height: 180,
			backgroundColor: '#29B6F6'
		};

		return (
			<div>
				<GnNavbar title='Arc studio' fixedTop/>
				<GnImageCarousel style={topItem} height={400} imageUrls={banners}/>
				<br/>
				<Row>
					<Col xs={10} xsOffset={1} md={8} mdOffset={2}>
						<BuildingGrid user={this.props.app.user} onItemClick={this.onItemClick.bind(this)}/>
					</Col>
				</Row>
				<Panel style={footer}>
					<Row style={footerBackground}>
					</Row>
				</Panel>
			</div>
		);
	}
	onItemClick(id) {
		this.props.history.pushState(null, `/project/${id}`);
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