import React from 'react';
import Relay from 'react-relay';
import { TitleBar } from '../';

class Dashboard extends React.Component {
	render() {
		const contentStyle = {
			marginTop: 94
		};
		const navItems = [
			{ label: 'Project', link: '/console/project' },
			{ label: 'Configure', link: '/console/configure' }
		];

		return (
			<div style={contentStyle}>
				<TitleBar title='Arc Studio Dashboard' navItems={navItems} fixedTop/>
				{this.props.children}
				<br/><br/><br/><br/><br/><br/>
			</div>
		);
	}
}

export default Dashboard;