const React = require('react');

class ImageGrid extends React.Component {

  render() {

    return (
      <div className="image-grid h-100 w-100 color-light-grey">
        <div className="grid-header">
          <GridHeaderButtons/>
        </div>
        <GridImages
          images={this.props.sessionConfig.imagesArray}
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

function GridHeaderButtons(props) {
  const distinctCategories = [...new Set(props.sessionConfig.imagesArray.map(image => image.category))];
  const ButtonElements = distinctCategories.map(category => {
    return (<button key={category} className="btn">{category}</button>);
  });
  return (
    <div className="btn-group row d-flex justify-start">
      {ButtonElements}
    </div>
  );
}
