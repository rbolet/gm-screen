const React = require('react');

class UserLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    document.querySelector('#user-login-form').reset();

    const tellUser = document.querySelector('#login-response');
    const login = this.state;
    console.log(login);
    this.props.userLogin(login);
  }

  render() {

    return (
      <div className="user-login d-flex flex-column">
        <h4 className="text-light"></h4>
        <div className="w-100 h-25 text-light">
          <p id="login-response" className="pt-1">Please enter your user name and password</p>
        </div>
        <form id="user-login-form" onSubmit={this.handleSubmit}>
          <div className="form-group pt-4">
            <label htmlFor="user-name" className="text-light"> </label>
            <input value={this.state.userName} onChange={this.handleChange} type="text" required autoComplete="username" className="form-control" id="user-name" name="userName" aria-describedby="user name" placeholder="Enter User Name"/>
          </div>
          <div className="form-group">
            <label htmlFor="user-password" className="text-light"> </label>
            <input value = {this.state.password} onChange={this.handleChange} type="password" required autoComplete="current-password" className="form-control" id="password" name="password" placeholder="Password"/>
          </div>
          <button type="submit" className="btn btn-secondary text-light">Submit</button>
        </form>
      </div>
    );
  }
}

module.exports = UserLogin;
