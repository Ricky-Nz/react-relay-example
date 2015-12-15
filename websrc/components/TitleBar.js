import React, { PropTypes } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

class TitleBar extends React.Component {
	render() {
		const { title, navItems, style, ...otherProps } = this.props;
		const navViews = navItems&&navItems.map((item, index) =>
			<NavItem key={index} eventKey={index} href={item.link}>{item.label}</NavItem>);
		
		return (
			<Navbar {...otherProps} style={Object.assign({background: 'white'}, style)}>
				<Navbar.Header>
					<Navbar.Brand>
						<a href='/'>{title}</a>
					</Navbar.Brand>
					<Navbar.Toggle/>
				</Navbar.Header>
				<Navbar.Collapse>
					<Nav>
						{navViews}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

TitleBar.propTypes = {
	navItems: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.string,
		link: PropTypes.string
	})),
	title: PropTypes.string.isRequired
};

export default TitleBar;