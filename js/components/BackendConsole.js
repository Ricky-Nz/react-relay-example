import React from 'react';
import Relay from 'react-relay';
import { GnNavbar } from './elements';

class BackendConsole extends React.Component {
	render() {
		const contentStyle = {
			marginTop: 94
		};
		const navItems = [
			{ label: 'Project', link: '#/console/project' },
			{ label: 'Configure', link: '#/console/configure' }
		];

		return (
			<div style={contentStyle}>
				<GnNavbar title='Arc studio Dashboard' items={navItems} fixedTop/>
				{this.props.children}
				<br/><br/><br/><br/><br/><br/>
			</div>
		);
	}
}

export default BackendConsole;