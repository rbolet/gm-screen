import React from 'react';
import Header from './header';
import MenuView from './menu-view';
import produce from 'immer';

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

    this.returntoMenu = this.returntoMenu.bind(this);
    this.newUser = this.newUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.chooseRole = this.chooseRole.bind(this);
  }

  returntoMenu() {
    const config = produce(this.state.config, draft => {
      draft.user.userRole = null;
      for (const property in draft.gameSession) {
        draft.gameSession[property] = null;
      }
    });
    this.setState({ config, view: ['menu', 'chooseRole'] });
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
          const config = produce(this.state.config, draft => {
            draft.user.userId = jsonRes.userId;
            draft.userName = login.userName;
          });
          this.setState({ config, view: ['menu', 'chooseRole'] });
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
        if (!jsonRes) {
          this.loginFailed('failed');

        } else {
          const config = produce(this.state.config, draft => {
            draft.user.userId = jsonRes[0].userId;
            draft.user.userName = jsonRes[0].userName;
          });
          this.setState({ config, view: ['menu', 'chooseRole'] });
        }
      })
      .catch(err => { console.error(err); });
  }

  loginFailed(reason) {
    const config = produce(this.state.config, draft => {
      draft.user.auth = reason;
    });
    this.setState({ config });
  }

  chooseRole(role) {
    const config = produce(this.state.config, draft => {
      draft.user.userRole = role;
    });
    this.setState({ config, view: ['menu', 'chooseCampaign'] });
  }

  render() {
    const CurrentView = <MenuView
      config={this.state.config}
      view={this.state.view}
      loginUser={this.loginUser}
      newUser={this.newUser}
      chooseRole={this.chooseRole}/>;
    return (
      <div className="app h-100 w-100">
        <Header config={this.state.config} message={this.state.message} returnToMenu={this.returntoMenu}/>
        <div className="app-body">
          {CurrentView}
        </div>
      </div>
    );
  }
}

export default App;
