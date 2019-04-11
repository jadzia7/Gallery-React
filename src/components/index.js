import React, { Component } from 'react';
import { Route, HashRouter, Link, Redirect, Switch } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Dashboard from './protected/Dashboard';
import ImageGallery from './protected/ImageGallery';
import { logout } from '../helpers/auth';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { firebaseAuth } from '../config/constants';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{ pathname: '/login', state: { from: props.location } }}
            />
          )}
    />
  );
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? (
          <Component {...props} />
        ) : (
            <Redirect to="/upload" /> ,
            <Redirect to="/gallery" />
          )}
    />
  );
}

export default class App extends Component {
  state = {
    authed: false,
    loading: true
  };
  componentDidMount() {
    this.removeListener = firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authed: true,
          loading: false
        });
      } else {
        this.setState({
          authed: false,
          loading: false
        });
      }
    });
  }
  componentWillUnmount() {
    this.removeListener();
  }
  render() {
    const authButtons = this.state.authed ? (
      <span>
      <FlatButton label="Logout" onClick={() => { logout(); }} style={{ color: '#fff' }} />
      </span>
    ) : (
        <span>
          <Link to="/login">
            <FlatButton label="Login" style={{ color: '#fff' }} />
          </Link>
          <Link to="/register">
            <FlatButton label="Register" style={{ color: '#fff' }} />
          </Link>
        </span>
      );   
    const topbarButtons = (
      <div>
        <Link to="/">
          <FlatButton label="Home" style={{ color: '#fff' }} />
        </Link>
        <Link to="/gallery">
          <FlatButton label="Gallery" style={{ color: '#fff' }} />
        </Link>
        <Link to="/upload">
          <FlatButton label="Upload" style={{ color: '#fff' }} />
        </Link>        
        {authButtons}
      </div>
    );
    return this.state.loading === true ? (
      <h1>Loading</h1>
    ) : (
        <div>
          <HashRouter >
            <div>
              <AppBar style={{ background: '#22052e'}}
                title="Gallery"
                iconElementRight={topbarButtons}
                iconStyleRight={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '0'
                }}
              />
              <div className="container d-flex justify-content-center mt-3">
                <div className="row">
                  <Switch>
                    <Route path="/" exact component={Home} />
                    <PublicRoute
                      authed={this.state.authed}
                      path="/login"
                      component={Login}
                    />
                    <PublicRoute
                      authed={this.state.authed}
                      path="/register"
                      component={Register}
                    />
                    <PrivateRoute
                      authed={this.state.authed}
                      path="/upload"
                      component={Dashboard}
                    />
                    <PrivateRoute
                      authed={this.state.authed}
                      path="/gallery"
                      component={ImageGallery}
                    />
                    <Route render={() => <h3>No Match</h3>} />
                  </Switch>
                </div>
              </div>
            </div>
          </HashRouter>
        </div>
      );
  }
}