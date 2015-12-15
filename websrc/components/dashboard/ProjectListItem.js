import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { ListGroupItem } from 'react-bootstrap';

class DashboardProjectListItem extends React.Component {
	render() {
		const { id, name, order, promote } = this.props.building;
		return (
			<ListGroupItem header={name} active={id===this.props.select}
				href={`?select=${id}`}>
				{`${order&&('Order:'+order)||''} ${promote&&('Banner Slot:'+promote)||''}`}
			</ListGroupItem>
		);
	}
}

DashboardProjectListItem.propTypes = {
	select: PropTypes.string
};

export default Relay.createContainer(DashboardProjectListItem, {
	fragments: {
		building: () => Relay.QL`
			fragment on Building {
				id,
				name,
				order,
				promote
			}
		`
	}
});

