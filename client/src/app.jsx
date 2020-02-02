import React from 'react';
import Header from './components/header';
import MenuView from './views/menu-view';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'menu',
      message: '',
      config: {
        user: {
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
  }

  render() {
    const CurrentView = <MenuView config={this.state.config}/>;
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
