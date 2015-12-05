import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Pager, PageItem } from 'react-bootstrap';
import { GnNavbar, GnImageCarousel } from './elements';
import ProjectNamecard from './ProjectNamecard';
import ProjectSegment from './ProjectSegment';

class ProjectPage extends React.Component {
	render() {
		const { building } = this.props.app;
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
			<ProjectSegment key={index} segment={segment}/>)

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
					<PageItem href="#">Previous</PageItem>
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<PageItem href="#">Next</PageItem>
				</Pager>
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
					banner,
					thumbnail,
					${ProjectNamecard.getFragment('building')},
					labels,
					segments {
						${ProjectSegment.getFragment('segment')}
					}
				}
			}
		`
	}
});