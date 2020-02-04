const React = require('react');
const UserLogin = require('../components/user-login');

class MenuView extends React.Component {

  render() {
    let menuScreen = null;
    switch (this.props.view[1]) {
      case 'login':
        menuScreen = <UserLogin
          config={this.props.config}
          loginUser={this.props.loginUser}
          newUser={this.props.newUser}/>;
    }
    return (
      <div className="menu-view row col-12 justify-content-center align-items-center">
        {menuScreen}
      </div>
    );
  }
}

module.exports = MenuView;
