const React = require('react');
const SessionView = require('./session-view');
const MenuView = require('./menu-view');
const GMView = require('./gm-view');
const PlayerView = require('./player-view');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'menu',
      sessionConfig: {}
    };

    this.goToSessionView = this.goToSessionView.bind(this);
    this.playerJoinSession = this.playerJoinSession.bind(this);
    this.launchSession = this.launchSession.bind(this);
    this.returnToMenu = this.returnToMenu.bind(this);
  }

  playerJoinSession() {
    this.setState({ view: 'player' });
  }

  goToSessionView() {
    this.setState({ view: 'session' });
  }

  launchSession(sessionConfig) {

    this.setState({ view: 'gm', sessionConfig });
  }

  returnToMenu() {
    this.setState({ view: 'menu' });
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
        currentView = <GMView sessionConfig={this.state.sessionConfig}/>;
        break;
      case 'player':
        currentView = <PlayerView sessionId={1}/>;
    }
    return (
      <div className="app-container container-fluid vh-100 px-0">
        <header className="app-header bg-dark">
          <div onClick={this.returnToMenu} className="btn btn-secondary">Main Menu</div>
        </header>
        {currentView}
      </div>
    );
  }
}

module.exports = App;
