import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import { GnImageCarousel } from './elements';

class ProjectSegment extends React.Component {
	render() {
		const { title, content, images, mode } = this.props.segment;
		const contentStyle = {
			padding: '30px 0px'
		};
		switch(mode) {
			case 'LEFT':
				return (
					<Row style={contentStyle}>
						<Col xs={10} xsOffset={1} sm={5} smOffset={1} md={4} mdOffset={2}>
							<GnImageCarousel imageUrls={images} height={250}/>
						</Col>
						<Col xs={10} xsOffset={1} sm={5} smOffset={0} md={4} mdOffset={0}>
							<h4>{title}</h4>
							<p>{content}</p>
						</Col>
					</Row>
				);
			case 'RIGHT':
				return (
					<Row style={contentStyle}>
						<Col xs={10} xsOffset={1} sm={5} smOffset={1} md={4} mdOffset={2}>
							<h4>{title}</h4>
							<p>{content}</p>
						</Col>
						<Col xs={10} xsOffset={1} sm={5} smOffset={0} md={4} mdOffset={0}>
							<GnImageCarousel imageUrls={images} height={250}/>
						</Col>
					</Row>
				);
			case 'MIDDLE':
				return (
					<Row style={contentStyle}>
						<Col xs={10} xsOffset={1} md={6} mdOffset={3}>
							<h4>{title}</h4>
							<p>{content}</p>
						</Col>
						<Col xs={10} xsOffset={1} md={6} mdOffset={3}>
							<GnImageCarousel imageUrls={images} height={300}/>
						</Col>
					</Row>
				);
			case 'FILL':
				return (
					<Row style={contentStyle}>
						<Col xs={12}>
							<GnImageCarousel imageUrls={images} height={400}/>
						</Col>
					</Row>
				);
			default:
				return null;
		}
	}
}

export default Relay.createContainer(ProjectSegment, {
	fragments: {
		segment: () => Relay.QL`
			fragment on Segment {
				title,
				content,
				images,
				mode
			}
		`
	}
});