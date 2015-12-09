import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import SegmentText from './SegmentText';
import SegmentImages from './SegmentImages';
import ProjectNamecard from './ProjectNamecard';
import _ from 'underscore';

class ProjectSegments extends React.Component {
	render() {
		const building = this.props.building;
		const contentStyle = {
			padding: '30px 10px',
		    display: 'inline-block',
		    verticalAlign: 'middle',
		    'float': 'none'
		};
		const bslayout = {
			xs: 10,
			xsOffset: 1,
			sm: 4,
			smOffset: 0,
			md: 3,
			mdOffset: 0
		};
		const bsOffset = {
			smOffset: 2,
			mdOffset: 3
		};

		let segmentItems = building.segments.map((segment, index) => {
			if (index == 0) {
				return (
					<Col key={index} style={contentStyle} {...bslayout}>
						<SegmentText segment={segment}/>
					</Col>
				);
			}

			const segmentEdge = [];
			switch(segment.mode) {
				case 'LEFT':
					segmentEdge.push(
						<Col key={`i-${index}`} style={contentStyle} {...bslayout} {...bsOffset}>
							<SegmentImages segment={segment} height={250}/>
						</Col>
					);
					segmentEdge.push(
						<Col key={`t-${index}`} style={contentStyle} {...bslayout}>
							<SegmentText segment={segment}/>
						</Col>
					);
					break;
				case 'RIGHT':
					segmentEdge.push(
						<Col key={`t-${index}`} style={contentStyle} {...bslayout} {...bsOffset}>
							<SegmentText segment={segment}/>
						</Col>
					);
					segmentEdge.push(
						<Col key={`i-${index}`} style={contentStyle} {...bslayout}>
							<SegmentImages segment={segment} height={250}/>
						</Col>
					);
					break;
				case 'MIDDLE':
					segmentEdge.push(
						<Col key={`t-${index}`} style={contentStyle} xs={10} xsOffset={1} md={6} mdOffset={3}>
							<SegmentText segment={segment}/>
						</Col>
					);
					segmentEdge.push(
						<Col key={`i-${index}`} style={contentStyle} xs={10} xsOffset={1} md={6} mdOffset={3}>
							<SegmentImages segment={segment} height={300}/>
						</Col>
					);
					break;
				case 'FILL':
					segmentEdge.push(
						<Col key={index} style={contentStyle} xs={12}>
							<SegmentImages segment={segment} height={400}/>
						</Col>
					);
					break;
			}

			return segmentEdge;
		});
		segmentItems = _.flatten(segmentItems)
		segmentItems.unshift(
			<Col key='start' style={{position:'relative'}} {...bslayout} {...bsOffset}>
				<ProjectNamecard style={{position:'absolute',top:-77}} building={building}/>
				<div style={{height:150}}/>
			</Col>
		);

		return (
			<Row>
				{segmentItems}
			</Row>
		);
	}
}

export default Relay.createContainer(ProjectSegments, {
	fragments: {
		building: () => Relay.QL`
			fragment on Building {
				${ProjectNamecard.getFragment('building')}
				segments {
					mode
					${SegmentText.getFragment('segment')}
					${SegmentImages.getFragment('segment')}
				}
			}
		`
	}
});