import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import _ from 'underscore';

class GnSelectableTags extends React.Component {
	render() {
		const contentStyle = {
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap',
			padding: '10px 0px'
		};
		const itemStyle = {
			margin: '2px 4px'
		};
		const itemViews = this.props.tags&&this.props.tags.map((tag, index) =>(
			<Button key={index} style={itemStyle} bsSize='xsmall' bsStyle={tag.select?'info':'default'}
				onClick={this.onItemClick.bind(this, tag.label)}>{tag.label}</Button>
		));
		const hasSelection = _.some(this.props.tags, tag => tag.select);

		return (
			<div style={contentStyle}>
				<Button style={itemStyle} bsSize='xsmall' bsStyle={hasSelection?'default':'info'}
					onClick={this.onItemClick.bind(this, null)}>All</Button>
				{itemViews}
			</div>
		);
	}
	onItemClick(label) {
		this.props.onItemClick(label);
	}
}

GnSelectableTags.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.string.isRequired,
		select: PropTypes.bool.isRequired
	})),
	onItemClick: PropTypes.func
};

export default GnSelectableTags;