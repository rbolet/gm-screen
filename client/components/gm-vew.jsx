import React from 'react';
import ImageGrid from './image-grid';
import TokensDisplay from './tokens';

class GMView extends React.Component {
  constructor(props) {
    super(props);

    this.onGMGridClick = this.onGMGridClick.bind(this);
  }

  onGMGridClick(image) {
    switch (image.category) {
      case 'Environment':
        this.props.updateEnvironmentImage(image);
        break;
      case 'Secondary':
        this.props.addToken(image);
    }

  }

  render() {

    return (
      <div className="gm-view row no-gutters h-100 w-100">
        <HeroView
          session={this.props.config.gameSession.session}
          clearEnvironmentImage={this.props.clearEnvironmentImage}
          removeToken={this.props.removeToken}
          clearAllTokens={this.props.clearAllTokens}/>
        <div className="image-grid-container col-4">
          <ImageGrid onGridClick={this.onGMGridClick} campaignAssets={this.props.config.gameSession.campaignAssets}/>
        </div>
      </div>
    );
  }
}

function HeroView(props) {
  let HeroView;
  if (props.session.environmentImageFileName) {
    HeroView = (
      <div className="environment-image h-100 w-100 position-relative" style={{ backgroundImage: `url(./images/${props.session.environmentImageFileName})` }}>
        <div className="close m-1"><i className="fa fa-times-circle" onClick={props.clearEnvironmentImage}></i></div>
      </div>
    );
  } else {
    HeroView = (
      <div className="placeholder d-flex justify-content-center align-items-center w-100 h-100">
        <div className="fade-loop w-100" id="GM-alt-text">GM-Screen</div>
      </div>
    );
  }

  return (
    <div className="hero-view col-8 h-100">
      {HeroView}
      <TokensDisplay tokens={props.session.tokens} removeToken={props.removeToken} clearAllTokens={props.clearAllTokens}/>
    </div>
  );
}

export default GMView;
