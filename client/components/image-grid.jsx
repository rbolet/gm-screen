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
        <GridImages images={this.state.sessionConfig.imagesArray}/>
      </div>

    );
  }
}

function GridImages(props) {

  const imageElements = props.images.map(image => {
    return (
      <img
        key={image.imageId}
        src={`./images/${image.filename}`} className="grid-image"/>
    );
  });

  return (
    <div className="h-100 w-100 d-flex flex-wrap">
      {imageElements}
    </div>);
}

module.exports = ImageGrid;
