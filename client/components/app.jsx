const React = require('react');
const SessionView = require('./session-view');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'session'
    };
  }

  render() {
    return (
      <div className="app-container container-fluid vh-100 px-0">
        <header className="app-header"></header>
        <SessionView/>
      </div>
    );
  }
}

module.exports = App;
