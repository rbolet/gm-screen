import React from 'react';

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
      <div className="image-grid w-100 color-light-grey">
        <div className="image-grid-header px-3">
          <GridHeaderButtons
            campaignAssets={this.props.campaignAssets}
            selectedTab={this.state.selectedTab}
            onClick={this.selectCategory}
            gmView={this.props.gmView}
            setCampaign={this.props.setCampaign}/>
        </div>
        <GridImages
          images={this.props.campaignAssets}
          selectedTab={this.state.selectedTab}
          onClick={this.props.onGridClick}
          campaignName={this.props.campaignName}/>
      </div>

    );
  }
}

function GridHeaderButtons(props) {

  const distinctCategories = [...new Set(props.campaignAssets.map(image => image.category))];
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
      {/* {props.gmView && <button type="button" className="btn btn-secondary col-2" onClick={() => { props.setCampaign(props.gmView); }}><i className="fas fa-cogs" /></button>} */}
    </div>
  );
}

function GridImages(props) {

  let GridContent = null;

  if (props.images.length) {
    GridContent = props.images.map(image => {
      if (image.category === props.selectedTab) {
        return (
          <img
            key={image.imageId}
            src={`./images/${image.fileName}`}
            className="grid-image m-1"
            onClick={props.onClick.bind(this, image)}/>
        );
      }
    });
  } else {
    GridContent = (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="img-thumbnail text-muted">
          {`No images have been added to ${props.campaignName}`}
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 image-grid-body mb-1 rounded">
      {GridContent}
    </div>);
}

export default ImageGrid;
