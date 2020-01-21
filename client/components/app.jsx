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
    this.loginUser = this.loginUser.bind(this);
  }

  loginUser(login) {
    const loginJSON = JSON.stringify(login);
    fetch('/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: loginJSON
    })
      .then(res => {
        if (!res.ok) {
          this.loginFailed();
        } else {
          return res.json();
        }
      })
      .then(jsonRes => {
        if (!jsonRes) return;
        const playerConfig = jsonRes[0];
        this.setState({ playerConfig });
      })
      .catch(err => { console.error(err); });
  }

  loginFailed() {
    const playerConfig = { auth: 'failed' };
    this.setState({ playerConfig });
  }

  playerJoinSession(sessionConfig) {
    if (!sessionConfig.sessionId) {
      return;
    }
    this.setState({ view: 'player', sessionConfig });
  }

  goToSessionView(sessionConfig) {
    this.setState({
      view: 'session',
      sessionConfig
    });
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
          loginUser={this.loginUser}/>;
        break;
      case 'session':
        currentView = <SessionView
          launchSession={this.launchSession}
          sessionConfig={this.state.sessionConfig}/>;
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
