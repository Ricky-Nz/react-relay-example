import React from 'react';
import Relay from 'react-relay';
import { Row, Col, Panel, Nav, NavItem } from 'react-bootstrap';
import { GnImageCarousel, GnNavbar, GnSelectableTags } from './elements';
import BuildingGridItem from './BuildingGridItem';
import PageFooter from './PageFooter';

class MainPage extends React.Component {
	render() {
		const { user } = this.props.app;
		const topItem = {
			marginTop: 50,
			zIndex: 3,
			WebkitBoxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)',
			MozBoxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)',
			boxShadow: 'inset 0px 0px 35px 0px rgba(10,10,0,0.5)'
		};
		const gridContentStyle = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			flexWrap: 'wrap'
		};
		const gridItems = user.buildings.edges.map(({node}, index) => (
			<BuildingGridItem key={index} building={node}
				onClick={(building) => this.onGridItemClick(building)}/>
		));
		const banners = user.promotes.edges.map(edge => edge.node.banner);
		const categoryViews = user.categories.map((category, index) =>
			<NavItem key={index} eventKey={index} href='#'>{category}</NavItem>);
		const filters = this.props.location.query.filter&&this.props.location.query.filter.split(',');
		const tagArray = user.labels&&user.labels.map(label => ({
			label,
			select: (filters&&filters.indexOf(label)>=0)?true:false
		}));

		return (
			<div>
				<GnNavbar title='Arc studio' fixedTop/>
				<GnImageCarousel style={topItem} height={400}
					imageUrls={banners} interval={4000} indicators
					onItemSelect={this.onBannerItemClick.bind(this)}/>
				<br/><br/><br/>
				<Row>
					<Col xs={10} xsOffset={1} md={8} mdOffset={2}>
						<Nav bsStyle='pills'>
							{categoryViews}
						</Nav>
						<GnSelectableTags tags={tagArray} onItemClick={this.onLabelSelect.bind(this)}/>
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
	onBannerItemClick(index) {
		this.props.history.push(`/project/${this.props.app.user.promotes.edges[index].node.id}`);
	}
	onGridItemClick(node) {
		this.props.history.push(`/project/${node.id}`);
	}
	onLabelSelect(label) {
		let filters = this.props.location.query.filter
			&&this.props.location.query.filter.split(',')||[];
		if (!label) {
			filters = [];
		} else if (filters.indexOf(label) >= 0) {
			filters.splice(filters.indexOf(label), 1);
		} else {
			filters.push(label);
		}

		const filter = filters.join(',');
		this.props.history.replace(`/${filter?('?filter='+filter):''}`);
	}
}

export default Relay.createContainer(MainPage, {
	initialVariables: {
		username: null,
		filter: null
	},
	prepareVariables: ({filter, ...otherParams}) => {
		return {
			filter: filter&&filter.split(','),
			...otherParams
		};
	},
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				user(name: $username) {
					categories,
					labels,
					buildings(labels: $filter, first: 1000) {
						edges {
							node {
								${BuildingGridItem.getFragment('building')}
							}
						}
					},
					promotes(first: 60) {
						edges {
							node {
								id,
								banner
							}
						}
					}
				}
			}
		`
	}
});