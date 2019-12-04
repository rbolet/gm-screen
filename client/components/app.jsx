const React = require('react');
const SessionImageList = require('./session-image-list');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {

    return (
      <div className="app-container container-fluid vh-100 px-0">
        <header className="app-header"></header>
        <div className="app-body">
          <SessionImageList/>
        </div>
      </div>
    );
  }
}

module.exports = App;
