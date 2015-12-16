import React, { PropTypes } from 'react';
import { Alert } from 'react-bootstrap';

class ProgressIndicator extends React.Component {
	constructor(props) {
		super(props);
		this.state = { show: false };
	}
	render() {
		if (!this.state.show) {
			return null;
		} else {
			return (
		        <Alert bsStyle={this.state.pennding?'warning':(this.state.success?'success':'danger')}
		        	onDismiss={this.dismiss.bind(this)} dismissAfter={this.state.dismissAfter}>
					<h4>{this.state.pennding?'Submitting':(this.state.success?'Success':'Failed')}</h4>
		        </Alert>
			);
		}
	}
	dismiss() {
		this.setState({
			show: false
		});
	}
	start() {
		this.setState({
			show: true,
			pennding: true,
			dismissAfter: null
		});
	}
	finish(success) {
		this.setState({
			show: true,
			pennding: false,
			dismissAfter: 3000,
			success
		});
	}
}

export default ProgressIndicator;