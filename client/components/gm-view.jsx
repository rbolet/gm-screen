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
    this.handleFooterClick = this.handleFooterClick.bind(this);
  }

  onGridClick(image) {
    const jsonBody = JSON.stringify({ fileName: image.fileName, sessionConfig: this.props.sessionConfig });

    switch (image.category) {
      case 'Environment':
      case 'Secondary' :
        fetch(`/updateImage/${image.category}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonBody
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

  handleFooterClick(image) {
    const copy = this.state.secondaryImagesArray;
    copy.map(secondaryImage => {
      delete secondaryImage.selected;
    });
    const selectedImage = copy.find(imageInArray => { return (image.randomKey === imageInArray.randomKey); });
    selectedImage.selected = true;
    this.setState({ secondaryImagesArray: copy });

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
            });
        })
        .catch(err => { console.error(err); });
    });

    this.socket.on('updateEnvironmentImage', fileName => {
      this.setState({ environmentImage: fileName });
    });

    this.socket.on('updateSecondaryImage', secondaryImage => {
      if (secondaryImage === null) {
        this.setState({ secondaryImagesArray: [] });
      } else {
        const copy = this.state.secondaryImagesArray;
        copy.push(secondaryImage);
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
          <div className="close m-1">
            <i className="fa fa-times-circle" onClick={this.clearEnvironmentImage}></i>
          </div>
          <SecondaryImages
            secondaryImagesArray={this.state.secondaryImagesArray}
            gmClick={this.clearAllSecondaryImages}
            removeOneImage={this.removeOneImage}
            handleFooterClick={this.handleFooterClick}/>
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
        <div id="modal-background d-none">
        </div>
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
