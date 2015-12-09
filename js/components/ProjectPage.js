import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Pager, PageItem } from 'react-bootstrap';
import { GnNavbar, GnImageCarousel, GnParallaxImage } from './elements';
import ProjectSegments from './ProjectSegments';
import PageFooter from './PageFooter';
import _ from 'underscore';

class ProjectPage extends React.Component {
	render() {
		const { building, user } = this.props.app;
		const bannerStyle = {
			marginTop: 50
		};
		const index = _.findIndex(user.buildings.edges, ({node}) => node.id === building.id);
		const previousItem = user.buildings.edges[index-1];
		const nextItem = user.buildings.edges[index+1];

		return (
			<div>
				<GnNavbar title='Arc studio' fixedTop/>
				<GnParallaxImage style={bannerStyle} height={400} imageUrl={building.banner}/>
				<ProjectSegments building={building}/>
				<br/><br/>
				<Pager>
					<PageItem href={`#/project/${previousItem&&previousItem.node.id}`} disabled={!previousItem}>Previous</PageItem>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<PageItem href={`#/project/${nextItem&&nextItem.node.id}`} disabled={!nextItem}>Next</PageItem>
				</Pager>
				<br/><br/>
				<PageFooter/>
			</div>
		);
	}
}

export default Relay.createContainer(ProjectPage, {
	initialVariables: {
		id: null
	},
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				building(id: $id) {
					id,
					banner,
					${ProjectSegments.getFragment('building')}
				},
				user {
					buildings(first: 1000) {
						edges {
							node {
								id
							}
						}
					}
				}
			}
		`
	}
});