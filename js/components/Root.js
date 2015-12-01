import React from 'react';
import Relay from 'react-relay';

export default class Root extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}