import React, { PropTypes } from 'react';
import { Navbar } from 'react-bootstrap';

class GnNavbar extends React.Component {
	render() {
		const {title, ...navProps} = this.props;
		const navStyle = {
			background: 'white'
		};
		
		return (
			<Navbar {...navProps} style={navStyle}>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#">{title}</a>
					</Navbar.Brand>
					<Navbar.Toggle />
				</Navbar.Header>
				<Navbar.Collapse>
					<Navbar.Text pullRight>
						Have a great day!
					</Navbar.Text>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

GnNavbar.propTypes = {
	title: PropTypes.string.isRequired
};

export default GnNavbar;