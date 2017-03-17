import React from 'react';
import { IndexRoute, Route } from 'react-router';

import App from './components/App';
import AlertsContainer from './components/Alerts/AlertsContainer'
import AdminHome from './components/AdminHome/Components/AdminHome';
import Home from './components/Home';
import UserHome from './components/UserHome/UserHome';
import AddAlert from './components/UserHome/AddAlert';
import AlertForm from './components/UserHome/AlertForm';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Login from './components/Account/Login';
import Signup from './components/Account/Signup';
import Profile from './components/Account/Profile';
import Forgot from './components/Account/Forgot';
import Reset from './components/Account/Reset';
import Trends from './components/Trends';

export default function getRoutes(store) {
    const ensureAuthenticated = (nextState, replace) => {
        if (!store.getState().auth.token) {
            replace('/login');
        }
    };
    const ensureIsAdmin = (nextState, replace) => {
        if (!store.getState().auth.user.admin) {
            replace('/');
        }
    };
    const ensureIsAdminOrPartner = (nextState, replace) => {
        if (!store.getState().auth.user.admin && !store.getState().auth.user.partner) {
            replace('/');
        }
    };

    const skipIfAuthenticated = (nextState, replace) => {
        if (store.getState().auth.token) {
            replace('/');
        }
    };
    const skipToHomeIfNotAuthenticatedOrPartner = (nextState, replace) => {
        if (!store.getState().auth.token || (store.getState().auth.user && store.getState().auth.user.partner)) {
            replace('/');
        }
    };
    const clearMessages = () => {
        store.dispatch({
            type: 'CLEAR_MESSAGES'
        });
    };
    return (
        <Route path="/" component={App}>
            <IndexRoute component={Home} onLeave={clearMessages}/>
            <Route path="/contact" component={Contact} onLeave={clearMessages}/>
            <Route path="/login" component={Login} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>
            <Route path="/signup" component={Signup} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>
            <Route path="/account" component={Profile} onEnter={ensureAuthenticated} onLeave={clearMessages}/>
            <Route path="/forgot" component={Forgot} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>
            <Route path='/reset/:token' component={Reset} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>
            <Route path="/userhome">
                <IndexRoute component={UserHome}
                            onEnter={skipToHomeIfNotAuthenticatedOrPartner}
                            onLeave={clearMessages}/>
            </Route>
            <Route path="/adminHome" component={AdminHome} onEnter={ensureIsAdmin} onLeave={clearMessages}/>
            <Route path="/alerts" component={AlertsContainer} onEnter={ensureIsAdminOrPartner} onLeave={clearMessages}/>
            <Route path="/addAlert" component={AddAlert} onEnter={ensureAuthenticated} onLeave={clearMessages}/>
            <Route path="/alert/:id" component={AlertForm} onEnter={ensureAuthenticated} onLeave={clearMessages}/>
            <Route path="/trends" component={Trends} onLeave={clearMessages}/>
            <Route path="*" component={NotFound} onLeave={clearMessages}/>
        </Route>
    );
}
