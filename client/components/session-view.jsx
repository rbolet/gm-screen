const React = require('react');
const SessionImageList = require('./session-image-list');
const Thumbnail = require('./thumbnail');

class SessionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesArray: [],
      thumbnailImage: null
    };

    this.onUploadSubmit = this.onUploadSubmit.bind(this);
    this.changeThumbnail = this.changeThumbnail.bind(this);
  }

  changeThumbnail(image) {
    this.setState({ thumbnailImage: image });
  }

  onUploadSubmit(event) {
    event.preventDefault();
    var formData = new FormData(event.target);

    fetch('/api/upload', { method: 'POST', 'content-type': 'multipart/form-data', body: formData })
      .then(res => res.json())
      .then(result => {
        this.setState((state, props) => {
          return { imagesArray: state.imagesArray.concat(result) };
        });
      });
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
      <div className="view-body row px-3">
        <SessionImageList
          images={this.state.imagesArray}
          changeThumbnail={this.changeThumbnail}
          onUploadSubmit={this.onUploadSubmit}/>
        <Thumbnail thumbnailImage={this.state.thumbnailImage} />
      </div>
    );
  }
}

module.exports = SessionView;
