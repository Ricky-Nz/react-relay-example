import React, { PropTypes } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class GnNavbar extends React.Component {
	render() {
		const {title, ...navProps} = this.props;
		const navStyle = {
			background: 'white'
		};
		const navItems = this.props.items&&this.props.items.map((item, index) =>
			<NavItem key={index} eventKey={index} href={item.link}>{item.label}</NavItem>);
		
		return (
			<Navbar {...navProps} style={navStyle}>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#">{title}</a>
					</Navbar.Brand>
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav>
						{navItems}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

GnNavbar.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.string,
		link: PropTypes.string
	})),
	title: PropTypes.string.isRequired
};

export default GnNavbar;