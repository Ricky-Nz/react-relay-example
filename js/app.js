import 'babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import { IndexRoute, Route } from 'react-router';
import { RelayRouter } from 'react-router-relay';
import { createHashHistory } from 'history';

import RootQueries from './queries/RootQueries';

import Root from './components/Root';
import BuildingList from './components/BuildingList';
import BuildingEditor from './components/BuildingEditor';

ReactDOM.render(
	<RelayRouter history={createHashHistory({ queryKey: false })}>
		<Route path='/' component={Root}>
			<IndexRoute component={BuildingList} queries={RootQueries}/>
			<Route path='/editor' component={BuildingEditor}
				queries={RootQueries}/>
		</Route>
	</RelayRouter>,
	document.getElementById('root')
);
