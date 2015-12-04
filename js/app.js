import 'babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { IndexRoute, Route } from 'react-router';
import { RelayRouter } from 'react-router-relay';
import { createHashHistory } from 'history';

import RootQueries from './queries/RootQueries';
import MainPage from './components/MainPage';
import BackendConsole from './components/BackendConsole';

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
	<RelayRouter history={createHashHistory({ queryKey: false })}>
		<Route path='/' component={Root}>
			<IndexRoute component={MainPage} queries={RootQueries}
				queryParams={['username']}/>
			<Route path='/console' component={BackendConsole}
				queries={RootQueries} queryParams={['username', 'select']}
				prepareParams={(params, route) => ({...params, fetchBuilding: params.select ? true : false})}/>
		</Route>
	</RelayRouter>,
	document.getElementById('root')
);
