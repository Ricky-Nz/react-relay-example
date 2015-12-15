import React from 'react';
import Relay from 'react-relay';
import { TitleBar, ParallaxBanner, PageFooter } from '../';
import ProjectSegments from './ProjectSegments';
import ProjectPager from './ProjectPager';

class ProjectPage extends React.Component {
	render() {
		const { building, buildings } = this.props.app;

		return (
			<div>
				<TitleBar title='Arc Studio Project' fixedTop/>
				<ParallaxBanner style={{marginTop: 50}} height={400} imageUrl={building.banner}/>
				<ProjectSegments building={building}/>
				<br/><br/>
				<ProjectPager app={this.props.app} currentId={this.props.relay.params.id}/>
				<br/><br/>
				<PageFooter/>
			</div>
		);
	}
}

export default Relay.createContainer(ProjectPage, {
	initialVariables: {
		id: null
	},
	fragments: {
		app: () => Relay.QL`
			fragment on App {
				building(id: $id) {
					banner,
					${ProjectSegments.getFragment('building')}
				},
				${ProjectPager.getFragment('app')}
			}
		`
	}
});