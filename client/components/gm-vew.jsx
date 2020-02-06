import React from 'react';
import ImageGrid from './image-grid';

class GMView extends React.Component {
  constructor(props) {
    super(props);

    this.onGridClick = this.onGridClick.bind(this);
  }

  onGridClick() {

  }

  render() {

    return (
      <div className="gm-view row no-gutters h-100 w-100">
        <HeroView
          session={this.props.config.gameSession.session}
          clearEnvironmentImage={this.props.clearEnvironmentImage}/>
        <div className="image-grid-container col-4">
          <ImageGrid onGridClick={this.props.onGridClick} campaignAssets={this.props.config.gameSession.campaignAssets}/>
        </div>
      </div>
    );
  }
}

function HeroView(props) {
  if (props.session.environmentImageFileName) {
    return (
      <div className="hero-view col-8 h-100">
        <div className="environment-image h-100 w-100" style={{ backgroundImage: `url(./images/${props.session.environmentImageFileName})` }}>
          <div className="close m-1">
            <i className="fa fa-times-circle" onClick={props.clearEnvironmentImage}></i>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="placeholder d-flex justify-content-center align-items-center col-8 h-100">
        <div className="fade-loop" id="GM-alt-text">GM-Screen</div>
      </div>
    );
  }
}

export default GMView;
