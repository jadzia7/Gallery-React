import React, { Component } from 'react';
import { auth } from '../helpers/auth';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Button } from 'react-bootstrap';
import './login.css';

const styles = {
  floatingLabelFocusStyle: {
      color: "#6D1B7B"
  }
}
function setErrorMsg(error) {
  return {
    registerError: error.message
  };
}

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      registerError: null,
      email: '',
      password: ''
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    auth(this.state.email, this.state.password).catch(e =>
      this.setState(setErrorMsg(e))
    );
  };
  render() {
    return (
      <div class='containerForm' style={{width: '700px'}}>
        <form onSubmit={this.handleSubmit} style={style.container}>
          <h3>Register</h3>
          <TextField style={{width: '600px'}}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            hintText="Enter your Email"
            floatingLabelText="Email"
            onChange={(event, newValue) => this.setState({ email: newValue })}
          />
          <br />
          <TextField style={{width: '600px'}}
           floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            type="password"
            hintText="Enter your Password"
            floatingLabelText="Password"
            onChange={(event, newValue) => this.setState({ password: newValue })}
          />
          <br /><br />
          <br /><br />
          {this.state.registerError && (
            <div role="alert">
              <span
                className="glyphicon glyphicon-exclamation-sign"
                aria-hidden="true"
              />
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.registerError}
            </div>
          )}
          <br />
          <Button type="submit" class='buttonForm' bsSize="large" block>Register</Button>

        </form>
      </div>
    );
  }
}

const raisedBtn = {
  margin: 15
};

const container = {
  textAlign: 'center'
};

const style = {
  raisedBtn,
  container
};
