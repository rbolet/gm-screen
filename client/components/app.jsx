const React = require('react');
const SessionView = require('./session-view');
const MenuView = require('./menu-view');
const GMView = require('./gm-view');
const PlayerView = require('./player-view');
const Header = require('./header');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: { menu: 'login' },
      sessionConfig: {},
      playerConfig: {},
      message: ''
    };

    this.chooseSession = this.chooseSession.bind(this);
    this.goToSessionView = this.goToSessionView.bind(this);
    this.playerJoinSession = this.playerJoinSession.bind(this);
    this.launchSession = this.launchSession.bind(this);
    this.returnToMenu = this.returnToMenu.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.newUser = this.newUser.bind(this);
    this.updateHeaderMessage = this.updateHeaderMessage.bind(this);
    this.logOut = this.logOut.bind(this);
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
          this.loginFailed('failed');
        } else {
          return res.json();
        }
      })
      .then(jsonRes => {
        if (!jsonRes) return;
        const playerConfig = jsonRes[0];
        this.setState({ playerConfig, view: { menu: 'chooseRole' } });
      })
      .catch(err => { console.error(err); });
  }

  loginFailed(reason) {
    const playerConfig = { auth: reason };
    this.setState({ playerConfig });
  }

  newUser(login) {
    const loginJSON = JSON.stringify(login);
    fetch('/newUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: loginJSON
    })
      .then(res => res.json())
      .then(jsonRes => {
        if (jsonRes.reason) {
          this.loginFailed(jsonRes.reason);
        } else {
          const playerConfig = { userId: jsonRes.userId, userName: login.userName };
          this.setState({ playerConfig, view: { menu: 'chooseRole' } });
        }
      })
      .catch(err => { console.error(err); });
  }

  chooseSession(role) {
    let view = {};
    switch (role) {
      case 'gm':
        view = { menu: 'gmChooseSession' };
        break;
      case 'player':
        view = { menu: 'playerChooseSession' };
        break;
    }
    this.setState({ view });

  }

  playerJoinSession(sessionConfig) {
    if (!sessionConfig.sessionId) {
      return;
    }
    this.setState({ view: 'player', sessionConfig });
  }

  goToSessionView(sessionConfig) {
    if (!sessionConfig.sessionId) {
      return;
    }
    this.setState({
      view: 'session',
      sessionConfig
    });
  }

  launchSession(sessionConfig) {

    this.setState({ view: 'gm', sessionConfig });
  }

  returnToMenu() {
    this.setState({ view: { menu: 'chooseRole' }, sessionConfig: {}, message: '' });
  }

  logOut() {
    this.setState({ playerConfig: {}, view: { menu: 'login' }, message: 'You have been logged out' });
  }

  updateHeaderMessage(message) {
    this.setState({ message });
  }

  render() {
    let currentView;
    if (this.state.view.menu) {
      currentView = <MenuView
        menu={this.state.view.menu}
        playerConfig={this.state.playerConfig}
        chooseSession={this.chooseSession}
        goToSessionView={this.goToSessionView}
        playerJoinSession={this.playerJoinSession}
        loginUser={this.loginUser}
        newUser={this.newUser}
        logOut={this.logOut} />;
    } else {
      switch (this.state.view) {

        case 'session':
          currentView = <SessionView
            launchSession={this.launchSession}
            sessionConfig={this.state.sessionConfig}/>;
          break;
        case 'gm':
          currentView = <GMView
            sessionConfig={this.state.sessionConfig}
            playerConfig={this.state.playerConfig}
            updateHeaderMessage={this.updateHeaderMessage}/>;
          break;
        case 'player':
          currentView = <PlayerView
            sessionConfig={this.state.sessionConfig}
            sessionId={this.state.sessionConfig.sessionId}
            playerConfig={this.state.playerConfig}
            updateHeaderMessage={this.updateHeaderMessage}/>;
      }
    }

    return (
      <div className="app-container container-fluid vh-100 px-0">
        <Header
          returnToMenu={this.returnToMenu}
          user={this.state.playerConfig.userName}
          session={this.state.sessionConfig.sessionName}
          message={this.state.message}/>
        {currentView}
      </div>
    );
  }
}

module.exports = App;
