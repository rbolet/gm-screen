import React from 'react';
import Header from './header';
import MenuView from './menu-view';
import produce from 'immer';
import CampaignConfig from './campaign-config';

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
          sessionId: null,
          sessionName: null,
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
    this.setCampaign = this.setCampaign.bind(this);
    this.onUploadSubmit = this.onUploadSubmit.bind(this);
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

  setCampaign(campaign) {
    let campaignAssets = [];
    const currentSession = JSON.stringify({ campaignId: this.state.config.gameSession.campaignId });
    fetch('/campaignAssets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: currentSession
    })
      .then(res => res.json())
      .then(resultsArray => {
        campaignAssets = resultsArray;
      })
      .catch(error => {
        console.error(`Error in GET return: ${error}`);
      });

    const config = produce(this.state.config, draft => {
      draft.gameSession.campaignId = campaign.campaignId;
      draft.gameSession.campaignName = campaign.campaignName;
      draft.gameSession.campaignAssets = campaignAssets;
    });

    this.setState({ config, view: ['campaignConfig', 'default'] });
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
        CurrentView = <CampaignConfig config={this.state.config} onUploadSubmit={this.onUploadSubmit}/>;
    }
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
