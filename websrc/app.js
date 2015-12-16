import React from 'react';
import Relay from 'react-relay';
import ReactDOM from 'react-dom';

import { IndexRoute, Route } from 'react-router';
import { RelayRouter } from 'react-router-relay';
import createBrowserHistory from 'history/lib/createBrowserHistory';
// import useScroll from 'scroll-behavior/lib/useStandardScroll';

import RootQueries from './queries/RootQueries';
import { HomePage } from './components/home';
import { ProjectPage } from './components/project';
import { Dashboard, DashboardConfigTab, DashboardProjectTab } from './components/dashboard';

Relay.injectNetworkLayer(
	new Relay.DefaultNetworkLayer('/api/graphql')
);

class Root extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

ReactDOM.render(
	<RelayRouter history={createBrowserHistory()}>
		<Route path='/' component={Root}>
			<IndexRoute component={HomePage} queries={RootQueries}
				queryParams={['filter']}/>
			<Route path='project/:id' component={ProjectPage}
				queries={RootQueries}/>
			<Route path='console' component={Dashboard}>)}/>
				<Route path='project' component={DashboardProjectTab}
					queries={RootQueries}/>
				<Route path='project/:id' component={DashboardProjectTab}
					queries={RootQueries}/>
				<Route path='configure' component={DashboardConfigTab}
					queries={RootQueries}/>
			</Route>
		</Route>
	</RelayRouter>,
	document.getElementById('root')
);
