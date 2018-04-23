// src/routes.js
import React from 'react';
import { Router, Route } from 'react-router';
import App from './App'
import NotFound from './NotFound';
import IveyResults from './resultsivey';
import QueensResults from './resultsqueen';
import DistinctionResults from './resultsdistinction'
import IveyFeedback from './feedbackIvey'
import QueensFeedback from './feedbackQueens'
import DistinctionFeedback from './feedbackDistinction'

const Routes = (props) => (
	<Router {...props}>
		<Route path="/" component={App} />
		<Route path="/ivey" component={IveyFeedback} />
		<Route path="/queens" component={QueensFeedback} />
		<Route path="/distinction" component={DistinctionFeedback} />
		<Route path="/iveyresults" component={IveyResults} />
		<Route path="/queensresults" component={QueensResults} />
		<Route path="/distinctionresults" component={DistinctionResults} />
		<Route path="*" component={NotFound} />
	</Router>
);

export default Routes;
