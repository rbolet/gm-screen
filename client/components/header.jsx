import React from 'react';

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
          <div onClick={this.props.returnToMenu} className="btn btn-secondary align-self-center ml-1">Main Menu</div>
        </div>
        <div className="col-2 text-light d-flex align-self-center justify-self-center">
          {this.props.config.user.userName}&nbsp;&nbsp;
          {RoleIcon}
        </div>
        <div className={'col-3 text-light d-flex align-items-center justify-content-center'}>{this.props.config.gameSession.campaignName}</div>
        <div className="col-5 text-light d-flex align-items-center justify-content-center">{this.props.message}</div>
        <div></div>
      </div>
    );
  }
}

export default Header;
