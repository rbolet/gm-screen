const React = require('react');
const SessionView = require('./session-view');
const MenuView = require('./menu-view');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'menu'
    };
  }

  render() {
    return (
      <div className="app-container container-fluid vh-100 px-0">
        <header className="app-header color-quartz"></header>
        {() => {
          switch (this.state.view) {
            case 'session':
              return <SessionView/>;
            case 'menu' :
              return <MenuView/>;
          }
        }
        }
      </div>
    );
  }
}

module.exports = App;
