import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Panel } from 'react-bootstrap';
import { TitleBar, PageFooter } from '../';
import HomeBanner from './HomeBanner';
import CategoryTabs from './CategoryTabs';
import LabelFilter from './LabelFilter';
import ProjectGrid from './ProjectGrid';

class HomePage extends React.Component {
	render() {
		const { labels, buildings, promotes } = this.props.app;

		return (
			<div>
				<TitleBar title='Arc studio' fixedTop/>
				<HomeBanner app={this.props.app}
					onItemClick={id => this.props.history.push(`/project/${id}`)}/>
				<Row>
					<Col xs={10} xsOffset={1} md={8} mdOffset={2}>
						<br/><br/><br/>
						<CategoryTabs app={this.props.app}/>
						<LabelFilter app={this.props.app} filter={this.props.relay.variables.filter}
							onFilterChange={this.onFilterChange.bind(this)}/>
						<ProjectGrid app={this.props.app}
							onGridItemClick={this.onGridItemClick.bind(this)}/>
					</Col>
				</Row>
				<br/><br/><br/><br/>
				<PageFooter/>
			</div>
		);
	}
	onFilterChange(selects) {
		this.props.history.replace(selects?`?filter=${selects}`:'/');
	}
	onGridItemClick(project) {
		this.props.history.push(`/project/${project.id}`);
	}
}

export default Relay.createContainer(HomePage, {
	initialVariables: {
		filter: null
	},
	prepareVariables: (variables) => {
		return {
			filter: variables.filter?variables.filter.split(','):null
		};
	},
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				${HomeBanner.getFragment('app')},
				${CategoryTabs.getFragment('app')},
				${LabelFilter.getFragment('app')},
				${ProjectGrid.getFragment('app')}
			}
		`
	}
});