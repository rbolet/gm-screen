const React = require('react');
const io = require('socket.io-client');
const SecondaryImages = require('./secondary-images');

class PlayerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      environmentImage: null,
      secondaryImagesArray: []
    };
  }

  componentDidMount() {
    this.socket = io('http://localhost:3001');
    this.socket.on('newSocketID', socketID => {
      // console.log(socketID);
    });

    this.socket.on('updateEnvironmentImage', fileName => {
      this.setState({ environmentImage: fileName });
    });

    this.socket.on('updateSecondaryImage', fileName => {
      const copy = this.state.secondaryImagesArray;
      copy.push(fileName);
      this.setState({ secondaryImagesArray: copy });
    });

    this.socket.on('clearOneImage', fileName => {
      const copy = this.state.secondaryImagesArray;
      const indexToRemove = copy.findIndex(fileNameInArray => fileName === fileNameInArray);
      copy.splice(indexToRemove, 1);

      this.setState({ secondaryImagesArray: copy });
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
