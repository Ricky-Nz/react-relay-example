import 'babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { IndexRoute, Route } from 'react-router';
import { RelayRouter } from 'react-router-relay';
import { createHashHistory } from 'history';

import ConsoleQueries from './queries/ConsoleQueries';

import Root from './components/Root';
import BackendConsole from './components/BackendConsole';

ReactDOM.render(
	<RelayRouter history={createHashHistory({ queryKey: false })}>
		<Route path='/' component={Root}>
			<Route path='/console/:username' component={BackendConsole}
				queries={ConsoleQueries} queryParams={['select']}/>
		</Route>
	</RelayRouter>,
	document.getElementById('root')
);
