import React, { Component } from 'react';
import { login, resetPassword } from '../helpers/auth';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Button, form } from 'react-bootstrap';
import './login.css';
function setErrorMsg(error) {
  return {
    loginMessage: error
  };
}

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loginMessage: null
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    login(this.state.email, this.state.password).catch(error => {
      this.setState(setErrorMsg('Invalid username/password.'));
    });
  };
  resetPassword = () => {
    resetPassword(this.state.email)
      .then(() =>
        this.setState(
          setErrorMsg(`Password reset email sent to ${this.state.email}. Check your email to reset password!`)
        )
      )
      .catch(error => this.setState(setErrorMsg(`Email address not found.`)));
  };
  render() {
    return (
      <div class='containerForm' style={{width: '700px'}}>
        <form
          style={style.container}
          onSubmit={event => this.handleSubmit(event)}
        >
          <h3>Login</h3>
          <TextField style={{width: '600px'}}
            hintText="Enter your Email"
            floatingLabelText="Email"
            onChange={(event, newValue) => this.setState({ email: newValue })}
          />
          <br />
          <TextField style={{width: '600px'}}
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            onChange={(event, newValue) => this.setState({ password: newValue })}
          />
          <br /><br />
          <br /><br />
          {this.state.loginMessage && (
            <div>
              <span
                className="glyphicon glyphicon-exclamation-sign"
                aria-hidden="true"
              />
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage}{' '}
              <Button onClick={this.resetPassword} className="alert-link">
                Forgot Password?
            </Button>
              {this.state.setErrorMsg}
            </div>
          )}
          <br />
          <Button type="submit" class='buttonForm' bsSize="large" block>Log In</Button>
        </form>
      </div>
    );
  }
}

const raisedBtn = {
  margin: 15,

};

const container = {
  textAlign: 'center'
};

const style = {
  raisedBtn,
  container
};
