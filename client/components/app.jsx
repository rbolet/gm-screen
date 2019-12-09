const React = require('react');
const SessionView = require('./session-view');
const MenuView = require('./menu-view');
const GMView = require('./gm-view');
const PlayerView = require('./player-view');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'menu'
    };

    this.goToSessionView = this.goToSessionView.bind(this);
    this.playerJoinSession = this.playerJoinSession.bind(this);
    this.launchSession = this.launchSession.bind(this);
  }

  playerJoinSession() {
    this.setState({ view: 'player' });
  }

  goToSessionView() {
    this.setState({ view: 'session' });
  }

  launchSession() {
    this.setState({ view: 'gm' });
  }

  render() {
    let currentView;
    switch (this.state.view) {
      case 'menu':
        currentView = <MenuView
          goToSessionView={this.goToSessionView}
          playerJoinSession={this.playerJoinSession}/>;
        break;
      case 'session':
        currentView = <SessionView launchSession={this.launchSession}/>;
        break;
      case 'gm':
        currentView = <GMView/>;
        break;
      case 'player':
        currentView = <PlayerView/>;
    }
    return (
      <div className="app-container container-fluid vh-100 px-0">
        <header className="app-header color-quartz"></header>
        {currentView}
      </div>
    );
  }
}

module.exports = App;
