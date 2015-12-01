import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Label, Row } from 'react-bootstrap';
import _ from 'underscore';

class GnSelectableTags extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	_onTagClicked(label) {
		this.setState({
			[label]: this.state[label] ? false : true
		});
	}
	render() {
		const content = {
			padding: '10px 0px',
			display: 'flex',
			flexDirection: 'row',
			flexWrap: 'wrap'
		};
		const labelStyle = {
			cursor: 'pointer',
			margin: 4,
			'userSelect': 'none'
		};
		const labels = this.props.labels.map((label, index) =>
			<h4 key={index} style={labelStyle}><Label bsStyle={this.state[label]?'info':'default'}
				onClick={this._onTagClicked.bind(this, label)}>{label}</Label></h4>
		);

		return (
			<div style={content}>
				{labels}
			</div>
		);
	}
	getSelection() {
		return _.filter(_.keys(this.state), label => this.state[label]);
	}
};

GnSelectableTags.propTypes = {
	labels: PropTypes.arrayOf(PropTypes.string).isRequired,
	onSelectChange: PropTypes.func
};

export default GnSelectableTags;


