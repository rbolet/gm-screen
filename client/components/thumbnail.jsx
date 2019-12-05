const React = require('react');

class Thumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnailImage: null
    };
  }

  render() {

    return (
      <div className="col h-100 d-inline-block">
        <div className="thumbnail-header text-center text-white">Preview</div>
        <div className="thumbnail-body rounded bg-light h-50 p-3 d-flex justify-content-center">
          {this.props.thumbnailImage &&
            <img className="img-thumbnail h-100 preview-image" src={`./images/${this.props.thumbnailImage.filename}`} alt="thumbnail"/>}
        </div>
        <div className="scene-list"></div>
      </div>
    );
  }
}

module.exports = Thumbnail;
