const React = require('react');
const io = require('socket.io-client');
const ImageGrid = require('./image-grid');
const SecondaryImages = require('./secondary-images');

class GMView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      environmentImage: null,
      secondaryImagesArray: []
    };

    this.socket = {};

    this.onGridClick = this.onGridClick.bind(this);
    this.clearEnvironmentImage = this.clearEnvironmentImage.bind(this);
    this.clearAllSecondaryImages = this.clearAllSecondaryImages.bind(this);
    this.removeOneImage = this.removeOneImage.bind(this);
  }

  onGridClick(image) {
    const imageFileName = JSON.stringify({ fileName: image.fileName });

    switch (image.category) {
      case 'Environment':
      case 'Secondary' :
        fetch(`/updateImage/${image.category}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: imageFileName
        })
          .catch(error => {
            alert(`Error in GET return: ${error}`);
          });
        break;
      default:
        alert(`Unknown category: ${image.category}`);
        break;
    }
  }

  clearEnvironmentImage() {
    fetch('/updateImage/Environment/all', { method: 'DELETE' })
      .then(confirmation => {

      })
      .catch(error => {
        alert(`Error in DELETE: ${error}`);
      });
  }

  clearAllSecondaryImages() {
    fetch('/updateImage/Secondary/all', { method: 'DELETE' })
      .then(confirmation => {

      })
      .catch(error => {
        alert(`Error in DELETE: ${error}`);
      });
  }

  removeOneImage(fileName) {
    fetch(`/updateImage/Secondary/${fileName}`, { method: 'DELETE' })
      .then(confirmation => {

      })
      .catch(error => {
        alert(`Error in DELETE: ${error}`);
      });
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
          const jsonSessionConfig = JSON.stringify({ sessionConfig: this.props.sessionConfig, socketId: this.socket.id });
          fetch('/launchSession', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: jsonSessionConfig
          })
            .then(res => res.json())
            .then(jsonRes => {
              this.props.updateHeaderMessage(jsonRes.message);
              console.log(jsonRes.launchedSessions);
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

    this.socket.on('updateHeader', message => {
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
          <div className="close m-1">
            <i className="fa fa-times-circle" onClick={this.clearEnvironmentImage}></i>
          </div>
          <SecondaryImages
            secondaryImagesArray={this.state.secondaryImagesArray}
            gmClick={this.clearAllSecondaryImages}
            removeOneImage={this.removeOneImage}/>
        </div>
      );
    } else {
      EnvironmentImageElement = (
        <div className="placeholder d-flex justify-content-center align-items-center">
          <div className="fade-loop" id="GM-alt-text">GM-Screen</div>
        </div>
      );
    }

    return (
      <div className="view-body d-flex justify-content-center align-items-center">
        <div className="row h-100 w-100">
          <div className="col-6 h-100">
            <div className="h-75">

              {EnvironmentImageElement}
            </div>
            <div className="h-25"></div>
          </div>
          <div className="col-6 h-100 p-2">
            <ImageGrid
              sessionConfig={this.props.sessionConfig}
              onGridClick={this.onGridClick}/>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = GMView;
