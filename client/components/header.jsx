import React from 'react';
import PlayerList from './player-list';

class Header extends React.Component {

  render() {

    let RoleIcon = null;
    switch (this.props.config.user.userRole) {
      case 'gm':
        RoleIcon = <i className="fas fa-hat-wizard text-danger"/>;
        break;
      case 'player':
        RoleIcon = <i className="fas fa-dice text-warning"/>;
        break;
    }

    return (
      <div className="app-header bg-dark col-12 row no-gutters justify-content-end">
        <div className="col-2 d-flex">
          <button className="btn btn-secondary align-self-center ml-2"
            onClick={this.props.returnToMenu}
            disabled={this.props.config.user.auth !== 'ok'} >
            {/* <i className="fas fa-home"/> */}
            <p className="button-text m-0">Return to Menu</p>
          </button>
        </div>
        <div className="col-2 text-light d-flex align-self-center justify-self-center">
          {this.props.config.user.userName}&nbsp;&nbsp;
          {RoleIcon}
        </div>
        <div className={'col-4 text-light d-flex align-items-center justify-content-center'}></div>
        <div className="col-3 text-light d-inline player-list-container">
          <PlayerList config={this.props.config} getPlayerList={this.props.getPlayerList} playerList={this.props.playerList}/>
        </div>
        <div className="col-1 d-flex align-items-center justify-content-end">
          <span onClick={this.props.toggleHelpModal}><i className="info far fa-question-circle text-white px-2"></i></span>
        </div>
      </div>
    );
  }
}

export default Header;
