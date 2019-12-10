const React = require('react');

class ImageGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionConfig: this.props.sessionConfig
    };
  }

  render() {

    return (
      <div className="image-grid h-100 w-100 color-light-grey">
        <GridImages
          images={this.state.sessionConfig.imagesArray}
          onClick={this.props.onGridClick}/>
      </div>

    );
  }
}

function GridImages(props) {

  const imageElements = props.images.map(image => {
    return (
      <img
        key={image.imageId}
        src={`./images/${image.fileName}`}
        className="grid-image border border-success"
        onClick={props.onClick.bind(this, image)}/>
    );
  });

  return (
    <div className="h-100 w-100 d-flex flex-wrap justify-content-around p-3">
      {imageElements}
    </div>);
}

module.exports = ImageGrid;
