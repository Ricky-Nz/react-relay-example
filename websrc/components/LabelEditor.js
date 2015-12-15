import React, { PropTypes } from 'react';
import { Label, Row, Col, Input, Button, Glyphicon } from 'react-bootstrap';

class LabelEditor extends React.Component {
	componentWillReceiveProps(nextProps) {
		if (nextProps.labels !== this.props.labels) {
			this.setState({newLabel: ''});
		}
	}
	render() {
		const { title, placeholder, labels } = this.props;
		const labelStyle = {
			cursor: 'pointer',
			margin: '6px 2px'
		};
		const tagViews = labels&&labels.map((label, index) =>
			<h4 key={index} style={labelStyle}>
				<Label bsStyle='info' onClick={this.onDeleteLabel.bind(this, index)}>{label}&nbsp;&nbsp;<Glyphicon glyph='remove'/></Label>
			</h4>
		);

		return (
			<Row>
				<Col xs={6}>
					<Input type='text' placeholder={placeholder} label={title}
						value={this.state&&this.state.newLabel} onChange={e => this.setState({ newLabel: e.target.value })}
						onKeyPress={e => (e.which===13)&&this.onCreateLabel()}
						buttonAfter={<Button onClick={this.onCreateLabel.bind(this)}>Add</Button>}/>
				</Col>
				<Col xs={12}>
					<div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 20}}>
						{tagViews}
					</div>
				</Col>
			</Row>
		);
	}
	onDeleteLabel(index) {
		const labels = this.props.labels;
		this.props.onLabelChange([...labels.slice(0, index), ...labels.slice(index + 1)]);
	}
	onCreateLabel() {
		const newLabel = this.state.newLabel;
		if (!newLabel || this.props.labels.indexOf(newLabel) >= 0) {
			this.setState({ newLabel: '' });
		} else {
			this.props.onLabelChange([...this.props.labels, newLabel]);
		}
	}
}

LabelEditor.propTypes = {
	title: PropTypes.string,
	placeholder: PropTypes.string,
	labels: PropTypes.arrayOf(PropTypes.string),
	onLabelChange: PropTypes.func.isRequired
};

export default LabelEditor;


