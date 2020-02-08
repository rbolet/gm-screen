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
      <div className="user-login d-flex flex-column justify-content-center col-3 bg-dark rounded">
        <div className="w-100 h-25 text-light text-center p-2 d-flex align-items-center justify-content-center menu-box-header">
          <div id="login-response" className="pt-1">{loginMessage}</div>
        </div>
        <form id="user-login-form" className="h-75" onSubmit={() => event.preventDefault()}>
          <div className="form-group pt-4">
            <label htmlFor="user-name" className="text-light"> </label>
            <input value={this.state.userName} onChange={this.handleChange} type="text" required autoComplete="username" className="form-control" id="user-name" name="userName" aria-describedby="user name" placeholder="Enter User Name"/>
          </div>
          <div className="form-group">
            <label htmlFor="user-password" className="text-light"> </label>
            <input value = {this.state.password} onChange={this.handleChange} type="password" required autoComplete="current-password" className="form-control" id="password" name="password" placeholder="Password"/>
          </div>
          <div className="d-flex h-25 w-100 align-items-center">
            <div className="menu-box-footer w-100 d-flex justify-content-between px-2">
              <button type="submit" className="btn btn-outline-light w-25" onClick={() => { this.userLogin(true); }}><i className="fas fa-user-plus"></i></button>
              <button type="submit" className="btn btn-success text-light w-25" onClick={() => { this.userLogin(false); }}><i className="fas fa-sign-in-alt"></i></button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default UserLogin;
