const React = require('react');

class ImageGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Environment'
    };

    this.selectCategory = this.selectCategory.bind(this);
  }

  selectCategory(category) {
    this.setState({ selectedTab: category });
  }

  render() {

    return (
      <div className="image-grid h-100 w-100 color-light-grey">
        <div className="grid-header px-3">
          <GridHeaderButtons
            sessionConfig={this.props.sessionConfig}
            selectedTab={this.state.selectedTab}
            onClick={this.selectCategory}/>
        </div>
        <GridImages
          images={this.props.sessionConfig.imagesArray}
          selectedTab={this.state.selectedTab}
          onClick={this.props.onGridClick}/>
      </div>

    );
  }
}

function GridHeaderButtons(props) {

  const distinctCategories = [...new Set(props.sessionConfig.imagesArray.map(image => image.category))];
  const ButtonElements = distinctCategories.map(category => {
    let showSelected = '';
    if (category === props.selectedTab) {
      showSelected = 'selected-tab';
    }
    return (<button
      key={category}
      onClick={props.onClick.bind(this, category)}
      className={`btn btn-outline-secondary ${showSelected}`}>{category}</button>);
  });
  return (
    <div className="btn-group row d-flex justify-start">
      {ButtonElements}
    </div>
  );
}

function GridImages(props) {

  const imageElements = props.images.map(image => {
    if (image.category === props.selectedTab) {
      return (
        <img
          key={image.imageId}
          src={`./images/${image.fileName}`}
          className="grid-image"
          onClick={props.onClick.bind(this, image)}/>
      );
    }
  });

  return (
    <div className="h-100 w-100 d-flex flex-wrap justify-content-around p-3">
      {imageElements}
    </div>);
}

module.exports = ImageGrid;
