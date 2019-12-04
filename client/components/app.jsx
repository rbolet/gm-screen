const React = require('react');
const SessionImageList = require('./session-image-list');
const Thumbnail = require('./thumbnail');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesArray: [],
      thumbnailImage: null
    };

    this.changeThumbnail = this.changeThumbnail.bind(this);
  }

  changeThumbnail(image) {
    this.setState({ thumbnailImage: image });
  }

  componentDidMount() {
    fetch('/api/imagelist', { method: 'GET' })
      .then(res => res.json())
      .then(imagesArray => {
        this.setState({ imagesArray });
      })
      .catch(error => {
        alert(`Error in GET return: ${error}`);
      });
  }

  render() {

    return (
      <div className="app-container container-fluid vh-100 px-0">
        <header className="app-header"></header>
        <div className="app-body row">
          <SessionImageList images={this.state.imagesArray} changeThumbnail={this.changeThumbnail}/>
          <Thumbnail thumbnailImage={this.state.thumbnailImage}/>
        </div>
      </div>
    );
  }
}

module.exports = App;
