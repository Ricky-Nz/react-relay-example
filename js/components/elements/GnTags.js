import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Label, Row, Col, Input, Button, Glyphicon } from 'react-bootstrap';
import _ from 'underscore';

class GnTags extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.onPropChange(props);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.tags !== this.props.tags) {
			this.setState(this.onPropChange(nextProps));
		}
	}
	render() {
		const labelStyle = {
			cursor: 'pointer'
		};
		const tagViews = this.state.tags.map((label, index) =>
			<h4 key={index} style={labelStyle}>
				<Label bsStyle='info' onClick={this.onTagClicked.bind(this, index)}>{label}&nbsp;&nbsp;<Glyphicon glyph='remove'/></Label>
			</h4>
		);

		return (
			<Row>
				<Col xs={6}>
					<Input type='text' placeholder={this.props.placeholder} label={this.props.label}
						value={this.state.newTag} onChange={this.onNewTagChange.bind(this)}
						buttonAfter={<Button onClick={this.onAddNewTag.bind(this)}>Add</Button>}/>
				</Col>
				<Col xs={6}>
					{tagViews}
				</Col>
			</Row>
		);
	}
	onPropChange(props) {
		return {
			tags: props.tags||[],
			newTag: ''
		};
	}
	onTagClicked(index) {
		this.setState({
			tags: [...this.state.tags.slice(0, index), ...this.state.tags.slice(index + 1)]
		});
	}
	onNewTagChange(e) {
		this.setState({ newTag: e.target.value });
	}
	onAddNewTag() {
		const newTag = this.state.newTag;
		if (!newTag || this.state.tags.indexOf(newTag) >= 0) {
			this.setState({ newTag: '' });
		} else {
			this.setState({
				tags: [...this.state.tags, this.state.newTag],
				newTag: ''
			});
		}
	}
	getTags() {
		return this.state.tags;
	}
}

GnTags.propTypes = {
	label: PropTypes.string,
	placeholder: PropTypes.string,
	tags: PropTypes.arrayOf(PropTypes.string)
};

export default GnTags;


