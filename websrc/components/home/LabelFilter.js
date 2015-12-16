import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { LabelSelector } from '../';

class LabelFilter extends React.Component {
	render() {
		const filters = this.props.filter&&this.props.filter.split(',');

		return (
			<LabelSelector showAllLabel={true} allLabels={this.props.app.labels} selectLabels={filters}
				onSelectChange={this.onSelectChange.bind(this)}/>
		);
	}
	onSelectChange(selects) {
		this.props.onFilterChange(selects&&selects.join(','));
	}
}

LabelFilter.propTypes = {
	filter: PropTypes.string,
	onFilterChange: PropTypes.func.isRequired
};

export default Relay.createContainer(LabelFilter, {
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				labels
			}
		`
	}
});