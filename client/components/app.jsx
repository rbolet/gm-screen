import React from 'react';
import Header from './header';
import MenuView from './menu-view';
import produce from 'immer';
import CampaignConfig from './campaign-config';
import GMView from './gm-vew';
import io from 'socket.io-client';

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
          campaignAssets: [],
          sessionUsers: {
            gm: null,
            players: []
          },
          session: {
            sessionId: null,
            sessionName: null,
            environmentImageFileName: null,
            tokens: []
          }
        }
      }
    };

    this.returntoMenu = this.returntoMenu.bind(this);
    this.newUser = this.newUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.chooseRole = this.chooseRole.bind(this);
    this.setCampaign = this.setCampaign.bind(this);
    this.onUploadSubmit = this.onUploadSubmit.bind(this);
    this.launchSession = this.launchSession.bind(this);
    this.updateEnvironmentImage = this.updateEnvironmentImage.bind(this);
    this.addToken = this.addToken.bind(this);
    this.removeToken = this.removeToken.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
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
            draft.user.auth = 'ok';
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
            draft.user.auth = 'ok';
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

  setCampaign(campaign) {
    const currentCampaign = JSON.stringify({ campaignId: campaign.campaignId });
    fetch('/campaignAssets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: currentCampaign
    })
      .then(jsonRes => jsonRes.json())
      .then(res => {
        const campaignAssets = res;
        const config = produce(this.state.config, draft => {
          draft.gameSession.campaignId = campaign.campaignId;
          draft.gameSession.campaignName = campaign.campaignName;
          draft.gameSession.campaignAssets = campaignAssets;
        });

        this.setState({ config, view: ['campaignConfig', 'default'] });
      })
      .catch(error => {
        console.error(`Error in GET return: ${error}`);
      });
  }

  onUploadSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    fetch('/upload', { method: 'POST', 'content-type': 'multipart/form-data', body: formData })
      .then(res => res.json())
      .then(result => {
        const config = produce(this.state.config, draft => {
          draft.gameSession.campaignAssets.push(result);
        });
        this.setState({ config });
      })
      .catch(err => { console.error(err); });

    document.querySelector('#upload-file').reset();
    document.querySelector('#filepath-label').innerText = '';
  }

  launchSession() {
    const stateConfig = JSON.stringify(this.state.config);
    fetch('/launchSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: stateConfig
    })
      .then(res => res.json())
      .then(resSession => {
        const session = resSession;
        const config = produce(this.state.config, draft => {
          draft.gameSession.sessionUsers.gm = draft.user;
          draft.gameSession.session = session;
        });
        this.setState({ config, view: ['gmView', 'default'] });
      })
      .catch(err => console.error(err));
  }

  updateEnvironmentImage(image) {
    const requestBody = JSON.stringify({
      gameSession: this.state.config.gameSession,
      newImage: image
    });

    fetch('/updateEnvironment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    });
  }

  addToken(image) {
    const requestBody = JSON.stringify({
      gameSession: this.state.config.gameSession,
      image: image
    });

    fetch('/addToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    });
  }

  removeToken(token) {
    const requestBody = JSON.stringify({
      gameSession: this.state.config.gameSession,
      token
    });

    fetch('/removeToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: requestBody
    });
  }

  connectSocket() {
    this.socket = io('/');
    async function socketIdToState(stateConfig, socketId) {
      return produce(stateConfig, draft => { draft.user.socketId = socketId; });
    }

    this.socket.on('connect', () => {
      socketIdToState(this.state.config, this.socket.id)
        .then(config => {
          const user = JSON.stringify(config.user);
          fetch('/configUserSocket', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: user
          })
            .then(jsonRes => jsonRes.json())
            .then(res => { this.setState({ message: res.message }); });

          return config;
        })
        .then(config => {
          this.setState({ config });
          this.launchSession();
        })
        .catch(err => console.error(err));
    });

    this.socket.on('updateSessionState', session => {
      const config = produce(this.state.config, draft => {
        draft.gameSession.session = session;
      });
      this.setState({ config });
    });

    this.socket.on('update', string => { this.setState({ message: string }); });
  }

  render() {
    let CurrentView;
    switch (this.state.view[0]) {
      case 'menu':
        CurrentView = <MenuView
          config={this.state.config}
          view={this.state.view}
          loginUser={this.loginUser}
          newUser={this.newUser}
          chooseRole={this.chooseRole}
          setCampaign={this.setCampaign}/>;
        break;
      case 'campaignConfig':
        CurrentView = <CampaignConfig config={this.state.config} onUploadSubmit={this.onUploadSubmit} connectSocket={this.connectSocket}/>;
        break;
      case 'gmView':
        CurrentView = <GMView
          config={this.state.config}
          updateEnvironmentImage={this.updateEnvironmentImage}
          clearEnvironmentImage={() => { this.updateEnvironmentImage(''); }}
          addToken={this.addToken}
          removeToken={this.removeToken}
          onGridClick={this.onGMGridClick}/>;
        break;
    }
    return (
      <div className="app row no-gutters h-100">
        <Header config={this.state.config} message={this.state.message} returnToMenu={this.returntoMenu}/>
        <div className="app-body row no-gutters">
          {CurrentView}
        </div>
      </div>
    );
  }
}

export default App;
