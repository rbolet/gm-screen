import React from 'react';
import UserLogin from './user-login';
import UserChooseCampaign from './user-choose-campaign';
import TitleScreen from './title-screen';

class MenuView extends React.Component {

  render() {
    let MenuScreen = null;
    const config = this.props.config;
    switch (this.props.view[1]) {
      case 'title':
        MenuScreen = <TitleScreen
          toggleHelpModal={this.props.toggleHelpModal}
          start={this.props.start} />;
        break;
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
        MenuScreen = <UserChooseCampaign config={this.props.config} setCampaign={this.props.setCampaign} newCampaign={this.props.newCampaign}/>;
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
      <div className="menu-box-header d-flex align-items-center justify-content-center p-2 h-25">
        <h5 className="text-light text-center mb-3">Choose Your Role</h5>
      </div>
      <form id="user-login-form" className="h-75">
        <div className="form-group pt-4">
          <button onClick={() => { props.chooseRole('gm'); }} className="btn btn-secondary my-4 w-100">
            Game Master&nbsp;&nbsp;<span><i className="fas fa-hat-wizard text-danger" /></span>
          </button>
        </div>
        <div className="form-group">
          <button onClick={() => { props.chooseRole('player'); }} className="btn btn-secondary mb-4 w-100">
            Player&nbsp;&nbsp;<span><i className="fas fa-dice text-warning" /></span>
          </button>
        </div>
        <div className="d-flex h-25 w-100 align-items-center">
          <div className="menu-box-footer w-100 d-flex justify-content-start px-2 pb-5">
            <button className="btn btn-danger text-white w-25" onClick={() => { }}><i className="fas fa-flip-horizontal fa-sign-out-alt"></i></button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MenuView;
