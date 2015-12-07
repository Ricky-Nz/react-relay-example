import React, { PropTypes } from 'react';
import { Label } from 'react-bootstrap';

class GnSelectableTags extends React.Component {
	render() {
		const contentStyle = {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap'
		};
		const itemStyle = {
			margin: '2px 4px'
		};
		const itemViews = this.props.tags&&this.props.tags.map((tag, index) =>(
			<Label key={index} style={itemStyle} bsStyle={tag.select?'info':'default'}>{tag.label}</Label>
		));

		return (
			<div style={contentStyle}>
				{itemViews}
			</div>
		);
	}
}

GnSelectableTags.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.string.isRequired,
		select: PropTypes.bool.isRequired
	}))
};

export default GnSelectableTags;