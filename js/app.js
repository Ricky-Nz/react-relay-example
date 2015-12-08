import 'babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { IndexRoute, Route } from 'react-router';
import { RelayRouter } from 'react-router-relay';
import { createHashHistory } from 'history';
import useScroll from 'scroll-behavior/lib/useStandardScroll';

import RootQueries from './queries/RootQueries';
import MainPage from './components/MainPage';
import ProjectPage from './components/ProjectPage';
import BackendConsole from './components/BackendConsole';
import ProjectConsole from './components/ProjectConsole';
import ConfigureConsole from './components/ConfigureConsole';

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
	<RelayRouter history={useScroll(createHashHistory)()}>
		<Route path='/' component={Root}>
			<IndexRoute component={MainPage} queries={RootQueries}
				queryParams={['username', 'filter']}/>
			<Route path='project/:id' component={ProjectPage}
				queries={RootQueries} queryParams={['username']}/>
			<Route path='console' component={BackendConsole}>
				<Route path='project' component={ProjectConsole}
					queries={RootQueries} queryParams={['username', 'select']}
					prepareParams={(params, route) => ({...params, fetchBuilding: params.select ? true : false})}/>
				<Route path='configure' component={ConfigureConsole}
					queries={RootQueries}/>
			</Route>
		</Route>
	</RelayRouter>,
	document.getElementById('root')
);
