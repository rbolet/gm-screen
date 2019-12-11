const React = require('react');
const io = require('socket.io-client');
const ImageGrid = require('./image-grid');
const SecondaryImages = require('./secondary-images');

class GMView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      environmentImage: null,
      secondaryImagesArray: [],
      sessionConfig: this.props.sessionConfig
    };
    this.onGridClick = this.onGridClick.bind(this);
    this.clearEnvironmentImage = this.clearEnvironmentImage.bind(this);
  }

  onGridClick(image) {
    const imageFileName = JSON.stringify({ fileName: image.fileName });

    switch (image.category) {
      case 'Environment':
      case 'Secondary' :
        fetch(`/api/updateImage/${image.category}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: imageFileName
        })
          .then(res => res.json())
          .then(confirmation => {
            // console.log(confirmation);
            this.setState({ environmentImage: image.fileName });
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
    fetch('/api/updateImage/Environment', { method: 'DELETE' })
      .then(confirmation => {
        // console.log(confirmation);
      })
      .catch(error => {
        alert(`Error in DELETE: ${error}`);
      });
  }

  componentDidMount() {
    this.socket = io('http://localhost:3001');
    this.socket.on('newSocketID', socketID => {
      // console.log(socketID);
    });
    this.socket.on('updateEnvironmentImage', fileName => {
      this.setState({ environmentImage: fileName });
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
          <SecondaryImages />
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
              sessionConfig={this.state.sessionConfig}
              onGridClick={this.onGridClick}/>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = GMView;
