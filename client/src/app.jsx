import React from 'react';
import Header from './components/header';
import MenuView from './views/menu-view';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: ['menu', 'login'],
      message: '',
      config: {
        user: {
          auth: null,
          userId: null,
          userName: null,
          userRole: null,
          socketId: null
        },
        gameSession: {
          campaignId: null,
          campaignName: null,
          sessionId: null,
          sessionName: null,
          sessionAssets: [],
          sessionState: {
            sessionUsers: {
              gm: null,
              players: []
            },
            environmentImage: null,
            activeSecondaries: []
          }
        }
      }
    };

    this.newUser = this.newUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
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
          this.setState({
            userId: jsonRes.userId, userName: login.userName
          });
        }
      })
      .catch(err => { console.error(err); });
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

  render() {
    const CurrentView = <MenuView config={this.state.config} view={this.state.view}/>;
    return (
      <div className="app h-100 w-100">
        <Header/>
        <div className="app-body">
          {CurrentView}
        </div>
      </div>
    );
  }
}
export default App;
