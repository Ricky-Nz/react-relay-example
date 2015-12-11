import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

class GnAlert extends React.Component {
	constructor(props) {
		super(props);
		this.state = { show: false };
	}
	render() {
		if (!this.state.show) {
			return null;
		} else {
			return (
		        <Alert bsStyle={this.state.success?'success':'danger'}
		        	onDismiss={this.dismiss.bind(this)} dismissAfter={this.props.dismissAfter}>
					<h4>{this.state.message}</h4>
		        </Alert>
			);
		}
	}
	dismiss() {
		this.setState({
			show: false,
			message: ''
		});
	}
	show(message, success) {
		this.setState({
			show: true,
			success,
			message
		});
	}
}

GnAlert.propTypes = {
	dismissAfter: PropTypes.number
};

GnAlert.defaultProps = {
	dismissAfter: 3000
};

export default GnAlert;