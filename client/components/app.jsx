const React = require('react');
const SessionImageList = require('./session-image-list');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesArray: []
    };
  }

  componentDidMount() {
    fetch('/api/imagelist', { method: 'GET' })
      .then(res => res.json())
      .then(imagesArray => {
        this.setState({ imagesArray });
      });
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
