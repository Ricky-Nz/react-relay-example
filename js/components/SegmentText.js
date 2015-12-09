import React from 'react';
import Relay from 'react-relay';

class SegmentText extends React.Component {
	render() {
		const { title, content } = this.props.segment;
		return (
			<div>
				<h4>{title}</h4>
				<p>{content}</p>
			</div>
		);
	}
}

export default Relay.createContainer(SegmentText, {
	fragments: {
		segment: () => Relay.QL`
			fragment on Segment {
				title
				content
			}
		`
	}
});