import React from 'react';
import Relay from 'react-relay';
import { Nav, NavItem } from 'react-bootstrap';

class CategoryTabs extends React.Component {
	render() {
		const { categories } = this.props.app;
		const categoryViews = categories&&categories.map((category, index) =>
			<NavItem key={index} eventKey={index} href='/'>{category}</NavItem>);

		return (
			<Nav bsStyle='pills'>
				{categoryViews}
			</Nav>
		);
	}
}

export default Relay.createContainer(CategoryTabs, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				categories
			}
		`
	}
});