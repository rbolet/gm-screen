import React from 'react';

class UserLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: ''
    };

    this.userLogin = this.userLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]: value });
  }

  userLogin(isNew) {
    const login = this.state;

    if (isNew) {
      this.props.newUser(login);
    } else {
      this.props.loginUser(login);
    }
    this.clearForm();
  }

  clearForm() {
    this.setState({
      userName: '',
      password: ''
    });
  }

  render() {
    let loginMessage = '';
    switch (this.props.config.user.auth) {
      case 'failed' :
        loginMessage = 'Invalid username and/or password';
        break;
      case 'injection' :
        loginMessage = 'Forbidden word in username';
        break;
      case 'invalidPassword':
        loginMessage = 'Password must be between 6 and 20 characters long';
        break;
      case 'invalidUserName':
        loginMessage = 'User name must be between 4 and 40 letters or numbers';
        break;
      case 'exists':
        loginMessage = 'User name already exists, please choose another or click "Log in"';
        break;
      case 'incomplete':
      default :
        loginMessage = 'Please enter your username and password';
    }
    return (
      <div className="row no-gutters">
        <div className="col-4"></div>
        <div className="user-login d-flex flex-column col-4 justify-self-center">
          <h4 className="text-light"></h4>
          <div className="w-100 h-25 text-light">
            <p id="login-response" className="pt-1">{loginMessage}</p>
          </div>
          <form id="user-login-form" onSubmit={() => event.preventDefault()}>
            <div className="form-group pt-4">
              <label htmlFor="user-name" className="text-light"> </label>
              <input value={this.state.userName} onChange={this.handleChange} type="text" required autoComplete="username" className="form-control" id="user-name" name="userName" aria-describedby="user name" placeholder="Enter User Name"/>
            </div>
            <div className="form-group">
              <label htmlFor="user-password" className="text-light"> </label>
              <input value = {this.state.password} onChange={this.handleChange} type="password" required autoComplete="current-password" className="form-control" id="password" name="password" placeholder="Password"/>
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-secondary text-light" onClick={() => { this.userLogin(false); }}>Log In</button>
              <button type="submit" className="btn btn-outline-light" onClick={() => { this.userLogin(true); }}>New User</button>
            </div>
          </form>
        </div>
        <div className="col-4"></div>
      </div>
    );
  }
}

export default UserLogin;
