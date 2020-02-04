import React from 'react';
import UserLogin from './user-login';

class MenuView extends React.Component {

  render() {
    let menuScreen = null;
    const config = this.props.config;
    switch (this.props.view[1]) {
      case 'login':
        menuScreen = <UserLogin
          config={config}
          loginUser={this.props.loginUser}
          newUser={this.props.newUser}/>;
        break;
      case 'chooseRole':
        menuScreen = <UserChooseRole chooseRole={this.props.chooseRole}/>;
    }
    return (
      <div className="menu-view row col-12 justify-content-center align-items-center">
        {menuScreen}
      </div>
    );
  }
}

function UserChooseRole(props) {

  return (
    <div className="user-choose-role d-flex flex-column justify-content-center col-3 bg-dark rounded">
      <h5 className="text-light text-center mb-3">Choose Your Role</h5>
      <button onClick={() => { props.chooseRole('gm'); }} className="btn btn-secondary mb-4">Game Master</button>
      <button onClick={() => { props.chooseRole('player'); }} className="btn btn-secondary mb-4">Player</button>
    </div>
  );
}

export default MenuView;
