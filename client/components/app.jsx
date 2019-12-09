const React = require('react');
const SessionView = require('./session-view');
const MenuView = require('./menu-view');
const GMView = require('./gm-view');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'menu'
    };

    this.goToSessionView = this.goToSessionView.bind(this);
    this.launchSession = this.launchSession.bind(this);
  }

  goToSessionView() {
    this.setState({ view: 'session' });
  }

  launchSession() {
    this.setState({ view: 'gm' });
  }

  render() {
    let currentView;
    switch (this.state.view) {
      case 'menu':
        currentView = <MenuView goToSessionView={this.goToSessionView}/>;
        break;
      case 'session':
        currentView = <SessionView launchSession={this.launchSession}/>;
        break;
      case 'gm':
        currentView = <GMView/>;
        break;
    }
    return (
      <div className="app-container container-fluid vh-100 px-0">
        <header className="app-header color-quartz"></header>
        {currentView}
      </div>
    );
  }
}

module.exports = App;
