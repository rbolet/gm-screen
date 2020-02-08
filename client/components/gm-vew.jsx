import React from 'react';
import HeroView from './hero-view';
import ImageGrid from './image-grid';

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

export default GMView;
