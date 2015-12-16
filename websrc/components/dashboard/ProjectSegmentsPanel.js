import React from 'react';
import Relay from 'react-relay';
import { Panel, Button } from 'react-bootstrap';
import SegmentItem from './SegmentItem';

class ProjectSegmentsEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.onPropChanged(props);
	}
	componentWillReceiveProps(nextProps) {
		this.setState(this.onPropChanged(nextProps));
	}
	render() {
		const flexEnd = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'flex-end',
			alignItems: 'center'
		};
		const contentSegmentsViews = this.state.segments.map((segment, index) =>
			<SegmentItem ref={index} key={index} index={index}
				segment={segment} onInsert={this.onSegmentChange.bind(this, index, false)}
				onDelete={this.onSegmentChange.bind(this, index, true)}/>);

		return(
			<Panel header='Details'>
				{contentSegmentsViews}
				<div style={flexEnd}>
					<Button bsSize='small' onClick={this.onSegmentChange.bind(this, -1, false)}>Add</Button>
				</div>
			</Panel>
		);
	}
	onPropChanged(props) {
		return {
			segments: props.project&&props.project.segments||[]
		};
	}
	onSegmentChange(index, del) {
		var newSegments;
		if (del) {
			newSegments = [...this.state.segments.slice(0, index), ...this.state.segments.slice(index + 1)];
		} else if (index >= 0) {
			newSegments = [...this.state.segments.slice(0, index), {}, ...this.state.segments.slice(index)];
		} else {
			newSegments = [...this.state.segments, {}];
		}
		this.setState({ segments: newSegments})
	}
	getSegments() {
		return this.state.segments.map((data, index) =>
			this.refs[index].getSegment());
	}
}

export default Relay.createContainer(ProjectSegmentsEditor, {
	fragments: {
		project: () => Relay.QL`
			fragment on Project {
				segments {
					title,
					content,
					images,
					mode
				}
			}
		`
	}
})