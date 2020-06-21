import React from 'react';
import logo from './logo.svg';
import { Switch, Route, Router, Redirect } from 'react-router-dom'
import NavBar from './NavBar/NavBar'
import SideBar from './SideBar/SideBar'
import './App.scss';
import createBrowserHistory from 'history/createBrowserHistory'
import todoIndexPage from './pages/todoIndexPage'
import taskPage from './pages/taskPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from './alert/alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/stackslide.css'
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-number-input/style.css';
import 'react-flags-select/css/react-flags-select.css';
import history from './history'

function App() {
  return (
    <Router history={history}>
      <div className="App">
            <Alert />

            <div>
                <NavBar  /> 
            </div> 
            <div>
                <SideBar />
            </div>
                    <Route path='/' exact component = {todoIndexPage} />
                    <Route path='/todos/:id' exact component ={taskPage}/>
                
            </div>

    </Router>
  );
}

export default App;
