// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';
import App from './App'
import NotFound from './NotFound';
import Results from './Results';

const Routes = (props) => (
	<Router {...props}>
		<Route path="/" component={NotFound} />
		<Route path="/ivey" component={App} />
		<Route path="/queens" component={App} />
		<Route path="/results" component={Results} />
		<Route path="*" component={NotFound} />
	</Router>
);

export default Routes;
