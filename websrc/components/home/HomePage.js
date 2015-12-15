import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Panel, Nav, NavItem } from 'react-bootstrap';
import { GnImageCarousel, GnNavbar, LabelSelector, PageFooter } from '../';
import HomeBanner from './HomeBanner';
import BuildingGridItem from './BuildingGridItem';

class HomePage extends React.Component {
	render() {
		const { categories, labels, buildings, promotes } = this.props.app;
		const gridContentStyle = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			flexWrap: 'wrap'
		};
		const gridItems = buildings.edges.map(({node}, index) => (
			<BuildingGridItem key={index} building={node}
				onClick={(building) => this.onGridItemClick(building)}/>
		));
		
		const categoryViews = categories.map((category, index) =>
			<NavItem key={index} eventKey={index} href='#'>{category}</NavItem>);
		const filters = this.props.location.query.filter&&this.props.location.query.filter.split(',');

		return (
			<div>
				<GnNavbar title='Arc studio' fixedTop/>
				<HomeBanner app={this.props.app}
					onItemClick={id => this.props.history.push(`/project/${id}`)}/>
				<br/><br/><br/>
				<Row>
					<Col xs={10} xsOffset={1} md={8} mdOffset={2}>
						<Nav bsStyle='pills'>
							{categoryViews}
						</Nav>
						<LabelSelector allLabels={labels} selectLabels={filters}
							onSelectChange={selects => {
								const filter = filters.join(',');
								this.props.history.replace(`/${filter?('?filter='+filter):''}`);
							}}/>
						<div style={gridContentStyle}>
							{gridItems}
						</div>
					</Col>
				</Row>
				<br/><br/><br/><br/>
				<PageFooter/>
			</div>
		);
	}
	onGridItemClick(node) {
		this.props.history.push(`/project/${node.id}`);
	}
}

export default Relay.createContainer(HomePage, {
	initialVariables: {
		filter: null
	},
	prepareVariables: ({filter}) => {
		return {
			filter: filter&&filter.split(',')
		};
	},
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				${HomeBanner.getFragment('app')},
				categories,
				labels,
				buildings(labels: $filter, first: 1000) {
					edges {
						node {
							${BuildingGridItem.getFragment('building')}
						}
					}
				}
			}
		`
	}
});