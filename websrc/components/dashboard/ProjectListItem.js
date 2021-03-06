import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { ListGroupItem } from 'react-bootstrap';

class DashboardProjectListItem extends React.Component {
	render() {
		const { id, name, order, promote } = this.props.project;
		return (
			<ListGroupItem header={name} active={id===this.props.select}
				href={`/console/project/${id}`}>
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
		project: () => Relay.QL`
			fragment on Project {
				id,
				name,
				order,
				promote
			}
		`
	}
});

