import React from 'react';
import Header from './header';
import MenuView from './menu-view';
import produce from 'immer';
import CampaignConfig from './campaign-config';
import GMView from './gm-vew';
import io from 'socket.io-client';
import PlayerView from './player-view';
import HelpModal from './help-modal';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: ['menu', 'title'],
      showHelpModal: false,
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
          campaignGM: null,
          campaignAssets: [],
          session: {
            sessionId: null,
            sessionName: null,
            environmentImageFileName: null,
            tokens: []
          }
        }
      }
    };

    this.start = this.start.bind(this);
    this.toggleHelpModal = this.toggleHelpModal.bind(this);
    this.returntoMenu = this.returntoMenu.bind(this);
    this.newUser = this.newUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.chooseRole = this.chooseRole.bind(this);
    this.newCampaign = this.newCampaign.bind(this);
    this.setCampaign = this.setCampaign.bind(this);
    this.onUploadSubmit = this.onUploadSubmit.bind(this);
    this.launchSession = this.launchSession.bind(this);
    this.updateEnvironmentImage = this.updateEnvironmentImage.bind(this);
    this.addToken = this.addToken.bind(this);
    this.removeToken = this.removeToken.bind(this);
    this.clearAllTokens = this.clearAllTokens.bind(this);
    this.connectSocket = this.connectSocket.bind(this);
  }

  start() {
    this.setState({ view: ['menu', 'login'] });
  }

  toggleHelpModal() {
    this.setState({ showHelpModal: !this.state.showHelpModal });
  }

  returntoMenu() {
    const message = 'returning to menu ...';
    const gameSession = {
      campaignId: null,
      campaignName: null,
      campaignGM: null,
      campaignAssets: [],
      session: {
        sessionId: null,
        sessionName: null,
        environmentImageFileName: null,
        tokens: []
      }
    };
    const config = produce(this.state.config, draft => {
      draft.gameSession = gameSession;
    });
    this.setState({ config, view: ['menu', 'chooseRole'], message });
  }

  logout() {
    const user = {
      auth: null,
      userId: null,
      userName: null,
      userRole: null,
      socketId: null
    };

    const config = produce(this.state.config, draft => {
      draft.user = user;
    });

    this.setState({ config, view: ['menu', 'title'] });
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

  newCampaign(campaignName) {
    const newCampaignBody = JSON.stringify({ user: this.state.config.user, campaignName });
    fetch('/newCampaign', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: newCampaignBody
    })
      .then(res => res.json())
      .then(campaign => { this.setCampaign(campaign); })
      .catch(err => console.error(err));
  }

  setCampaign(campaign, skip) {
    const currentCampaign = JSON.stringify({ campaign });
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
          draft.gameSession.campaignGM = campaign.campaignGM;
          draft.gameSession.campaignAssets = campaignAssets;
        });
        if (config.user.userRole === 'gm' && !skip) {
          this.setState({ config, view: ['campaignConfig', 'default'] });
        } else {
          this.setState({ config });
          this.connectSocket();
        }
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
        const gameSession = this.state.config.gameSession;
        const campaign = {
          campaignId: gameSession.campaignId,
          campaignName: gameSession.campaignName,
          campaignGM: gameSession.campaignGM
        };

        this.setState({ message: `uploaded ${result.image.alias}` });
        this.setCampaign(campaign);
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
          draft.gameSession.session = session;
        });
        this.setState({ config, view: [`${config.user.userRole}View`, 'default'] });
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

  clearAllTokens() {
    const requestBody = JSON.stringify({
      gameSession: this.state.config.gameSession
    });

    fetch('/clearAllTokens', {
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

    this.socket.on('update', message => { this.setState({ message }); });

    this.socket.on('kick', message => {
      this.socket.close();
      this.setState({ message });
      this.returntoMenu();
    });
  }

  render() {
    let CurrentView;
    switch (this.state.view[0]) {
      case 'menu':
        CurrentView = <MenuView
          toggleHelpModal={this.toggleHelpModal}
          start={this.start}
          config={this.state.config}
          view={this.state.view}
          loginUser={this.loginUser}
          newUser={this.newUser}
          chooseRole={this.chooseRole}
          newCampaign={this.newCampaign}
          setCampaign={this.setCampaign}
          joinSession={this.joinSession}/>;
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
          clearAllTokens={this.clearAllTokens}
          onGridClick={this.onGMGridClick}
          setCampaign={this.setCampaign}/>;
        break;
      case 'playerView':
        CurrentView = <PlayerView config={this.state.config}/>;
        break;
    }
    return (
      <div className="app row no-gutters h-100 d-relative">
        {this.state.showHelpModal && <HelpModal toggleHelpModal={this.toggleHelpModal}/>}
        <Header config={this.state.config} message={this.state.message} returnToMenu={this.returntoMenu}/>
        <div className="app-body row no-gutters">
          {CurrentView}
        </div>
      </div>
    );
  }
}

export default App;
