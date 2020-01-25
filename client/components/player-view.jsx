const React = require('react');
const io = require('socket.io-client');
const SecondaryImages = require('./secondary-images');

class PlayerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      environmentImage: null,
      secondaryImagesArray: [],
      sessionId: this.props.sessionId
    };

    this.socket = {};
  }

  componentDidMount() {
    this.socket = io('/');

    this.socket.on('connected', socketID => {
      const jsonPlayerConfig = JSON.stringify({ playerConfig: this.props.playerConfig, socketId: this.socket.id });
      fetch('/userJoined', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonPlayerConfig
      })
        .then(res => res.json())
        .then(jsonRes => {
          this.props.updateHeaderMessage(jsonRes.message);
        })
        .then(() => {
          const jsonSessionConfig = JSON.stringify({ sessionConfig: this.props.sessionConfig, socketId: this.socket.id });
          fetch('/joinSession', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: jsonSessionConfig
          })
            .then(res => res.json())
            .then(jsonRes => {
              this.props.updateHeaderMessage(jsonRes.message);
            });
        })
        .catch(err => { console.error(err); });
    });

    this.socket.on('updateEnvironmentImage', fileName => {
      this.setState({ environmentImage: fileName });
    });

    this.socket.on('updateSecondaryImage', fileName => {
      if (fileName === null) {
        this.setState({ secondaryImagesArray: [] });
      } else {
        const copy = this.state.secondaryImagesArray;
        copy.push(fileName);
        this.setState({ secondaryImagesArray: copy });
      }
    });

    this.socket.on('clearOneImage', fileName => {
      const copy = this.state.secondaryImagesArray;
      const indexToRemove = copy.findIndex(fileNameInArray => fileName === fileNameInArray);
      copy.splice(indexToRemove, 1);

      this.setState({ secondaryImagesArray: copy });
    });

    this.socket.on('update', message => {
      this.props.updateHeaderMessage(message);
    });
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    let EnvironmentImageElement = null;

    if (this.state.environmentImage) {
      EnvironmentImageElement = (
        <div className="environment-image h-100 w-100" style={{ backgroundImage: `url(./images/${this.state.environmentImage})` }}>
          <SecondaryImages
            secondaryImagesArray={this.state.secondaryImagesArray}
            id="secondary-player-view"/>
        </div>
      );
    } else {
      EnvironmentImageElement = (
        <div className="placeholder d-flex justify-content-center align-items-center">
          <div className="fade-loop h-100 w-100">GM-Screen</div>
        </div>
      );
    }

    return (
      <div className="view-body d-flex justify-content-center align-items-center">
        <div className="row h-100 w-100">
          <div className="col-12 h-100">
            <div className="h-100 p-2">
              {EnvironmentImageElement}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = PlayerView;
