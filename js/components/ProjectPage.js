import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Pager, PageItem } from 'react-bootstrap';
import { GnNavbar, GnImageCarousel } from './elements';
import ProjectNamecard from './ProjectNamecard';
import ProjectSegment from './ProjectSegment';
import PageFooter from './PageFooter';
import _ from 'underscore';

class ProjectPage extends React.Component {
	render() {
		const { building, user } = this.props.app;
		const topItem = {
			marginTop: 50
		};
		const segmentContent = {
			position: 'relative'
		};
		const nameCardStyle = {
			position: 'absolute',
			top: -85
		};
		const segmentPages = building.segments.map((segment, index) =>
			<ProjectSegment key={index} segment={segment}/>);
		const index = _.findIndex(user.buildings.edges, ({node}) => node.id === building.id);
		const previousItem = user.buildings.edges[index-1];
		const nextItem = user.buildings.edges[index+1];

		return (
			<div>
				<GnNavbar title='Arc studio' fixedTop/>
				<GnImageCarousel style={topItem} height={400} imageUrls={[building.banner]}/>
				<Row>
					<Col style={segmentContent} xs={10} xsOffset={1} sm={4} smOffset={2}>
						<ProjectNamecard style={nameCardStyle} building={building}/>
					</Col>
				</Row>
				{segmentPages}
				<Pager>
					<PageItem href={`#/project/${previousItem&&previousItem.node.id}`} disabled={!previousItem}>Previous</PageItem>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<PageItem href={`#/project/${nextItem&&nextItem.node.id}`} disabled={!nextItem}>Next</PageItem>
				</Pager>
				<br/><br/><br/><br/>
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
					thumbnail,
					${ProjectNamecard.getFragment('building')},
					segments {
						${ProjectSegment.getFragment('segment')}
					}
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