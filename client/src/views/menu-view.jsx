import React from 'react';
import UserLogin from '../components/user-login';

class MenuView extends React.Component {

  render() {
    let menuScreen = null;
    switch (this.props.view[1]) {
      case 'login':
        menuScreen = <UserLogin config={this.props.config}/>;
    }
    return (
      <div className="row no-gutters menu-view">
        {menuScreen}
      </div>
    );
  }
}

export default MenuView;
