import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <div className="app-header bg-dark col-12 row no-gutters justify-content-end">
        <div className="col-2">
          <div onClick={this.props.returnToMenu} className="btn btn-secondary align-self-start">Main Menu</div>
        </div>
        <div className="col-2 text-light d-flex align-items-center justify-content-center"><div>{this.props.config.user.userName}</div></div>
        <div className={'col-3 text-light d-flex align-items-center justify-content-center'}>{this.props.config.gameSession.campaignName}</div>
        <div className="col-5 text-light d-flex align-items-center justify-content-center">{this.props.message}</div>
      </div>
    );
  }
}

export default Header;
