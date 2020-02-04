import React from 'react';
import UserLogin from './user-login';
import UserChooseCampaign from './user-choose-campaign';

class MenuView extends React.Component {

  render() {
    let MenuScreen = null;
    const config = this.props.config;
    switch (this.props.view[1]) {
      case 'login':
        MenuScreen = <UserLogin
          config={config}
          loginUser={this.props.loginUser}
          newUser={this.props.newUser}/>;
        break;
      case 'chooseRole':
        MenuScreen = <UserChooseRole chooseRole={this.props.chooseRole}/>;
        break;
      case 'chooseCampaign':
        MenuScreen = <UserChooseCampaign config={this.props.config} setCampaign={this.props.setCampaign}/>;
        break;
    }
    return (
      <div className="menu-view row col-12 justify-content-center align-items-center">
        {MenuScreen}
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
