import React from 'react';
import Relay from 'react-relay';
import { TitleBar, ParallaxBanner, PageFooter } from '../';
import ProjectSegments from './ProjectSegments';
import ProjectPager from './ProjectPager';

class ProjectPage extends React.Component {
	componentDidMount() {
		setTimeout(() => window.scrollTo(0, 0), 10);
	}
	render() {
		const { project, projects } = this.props.app;

		return (
			<div>
				<TitleBar title='Arc Studio Project' fixedTop/>
				<ParallaxBanner style={{marginTop: 50}} height={400} imageUrl={project.banner}/>
				<ProjectSegments project={project}/>
				<br/><br/>
				<ProjectPager app={this.props.app} currentId={this.props.params.id}/>
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
				project(id: $id) {
					banner,
					${ProjectSegments.getFragment('project')}
				},
				${ProjectPager.getFragment('app')}
			}
		`
	}
});