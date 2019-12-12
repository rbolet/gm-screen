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
      <div className="col h-100 d-inline-block color-quartz rounded mx-1">
        <div className="thumbnail-header text-center text-white pt-2">Preview</div>
        <div className="thumbnail-body rounded bg-light h-75 p-3 d-flex justify-content-center">
          {this.props.thumbnailImage &&
            <img className="img-thumbnail h-100 preview-image" src={`./images/${this.props.thumbnailImage.fileName}`} alt="thumbnail"/>}
        </div>
        <div className="thumbnail-footer d-flex justify-content-center w-100 py-4">
          <button className="btn btn-secondary" onClick={this.props.launchSession}>Launch Session</button>
        </div>
      </div>
    );
  }
}

module.exports = Thumbnail;
