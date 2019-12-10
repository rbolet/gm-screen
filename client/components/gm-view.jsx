const React = require('react');
const io = require('socket.io-client');
const ImageGrid = require('./image-grid');

class GMView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      environmentImage: null,
      sessionConfig: this.props.sessionConfig
    };
    this.onGridClick = this.onGridClick.bind(this);
  }

  onGridClick(image) {
    const imageFileName = JSON.stringify({ fileName: image.fileName });
    fetch('/api/updateImage/environment', {
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

    return (
      <div className="view-body d-flex justify-content-center align-items-center">
        <div className="row h-100 w-100">
          <div className="col-6 h-100 border border-warning">
            <div className="h-75 border border-success">
              <div className="environment-image h-100 w-100" style={{ backgroundImage: `url(./images/${this.state.environmentImage})` }}></div>
            </div>
            <div className="h-25 border border-success"></div>
          </div>
          <div className="col-6 h-100 border border-warning p-2">
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
