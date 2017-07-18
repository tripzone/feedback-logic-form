// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';
import App from './App'
import NotFound from './NotFound';
import Results from './Results';
import IveyResults from './resultsivey';
import QueensResults from './resultsqueen';


const Routes = (props) => (
	<Router {...props}>
		<Route path="/" component={NotFound} />
		<Route path="/ivey" component={App} />
		<Route path="/queens" component={App} />
		<Route path="/results" component={Results} />
		<Route path="/iveyresults" component={IveyResults} />
		<Route path="/queensresults" component={QueensResults} />
		<Route path="*" component={NotFound} />
	</Router>
);

export default Routes;
