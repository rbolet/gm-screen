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
      sessionConfig: {},
      playerConfig: {}
    };

    this.goToSessionView = this.goToSessionView.bind(this);
    this.playerJoinSession = this.playerJoinSession.bind(this);
    this.launchSession = this.launchSession.bind(this);
    this.returnToMenu = this.returnToMenu.bind(this);
    this.userLogin = this.userLogin.bind(this);
  }

  userLogin(login) {
    const loginJSON = JSON.stringify(login);
    fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: loginJSON
    })
      .then(res => {
        if (res.ok) {
          this.setState({ playerConfig: res });
        } else {
          const playerConfig = { auth: 'failed' };
          this.setState({ playerConfig });
        }
      })
      .catch(err => { alert(err.message); });
  }

  playerJoinSession(sessionConfig) {
    if (!sessionConfig) {
      return;
    }
    this.setState({ view: 'player', sessionConfig });
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
          playerConfig={this.state.playerConfig}
          goToSessionView={this.goToSessionView}
          playerJoinSession={this.playerJoinSession}
          userLogin={this.userLogin}/>;
        break;
      case 'session':
        currentView = <SessionView launchSession={this.launchSession}/>;
        break;
      case 'gm':
        currentView = <GMView sessionConfig={this.state.sessionConfig}/>;
        break;
      case 'player':
        currentView = <PlayerView sessionId={this.state.sessionConfig.sessionId}/>;
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
