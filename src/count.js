import React, { Component } from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import logo from './logo.svg';
import './App.css';

const appState = observable({
	count: 0
})
appState.handleInc = function(x) {
	this.count = this.count + parseInt(x);
}
appState.handleDec = function() {
	this.count--;
}

@observer class App extends Component {
	// @observable count = 0;
	//
	handleDec = () => {
		appState.handleDec()
	}

	handleInc = (x) => {
		appState.handleInc(x)
	}


	render() {
		return (
			<div className="App">
				<div className="App-header">
					{appState.count}
					<img src={logo} className="App-logo" alt="logo" />
					<h2>Welcome to React</h2>
				</div>
				<button onClick={this.handleDec}>Decrease</button>
				<button onClick={() => this.handleInc(3)}>INCREASE</button>
			</div>


		);
	}
}

export default App;
