import React, { Component } from 'react';
import './App.css';
import NavBar from './NavBar';
import Dashboard from './Dashboard';

class App extends Component {
    render() {
        return (
            <div className="App">
                <NavBar/>
                <Dashboard/>
            </div>
        );
    }
}

export default App;
