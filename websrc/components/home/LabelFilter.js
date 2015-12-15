import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { LabelSelector } from '../';

class LabelFilter extends React.Component {
	render() {
		const filterString = window.location.params('filter');
		const filters = filterString&&filterString.split(',');

		return (
			<LabelSelector allLabels={labels} selectLabels={filters}
				onSelectChange={this.onSelectChange.bind(this)}/>
		);
	}
	onSelectChange(selects) {
		const filter = selects&&selects.join(',');
		window.location.params(filter?{}:{filter:filter});
		this.onFilterChange(selects);
	}
}

LabelFilter.propTypes = {
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