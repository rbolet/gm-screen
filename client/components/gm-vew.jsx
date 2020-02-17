import React from 'react';
import HeroView from './hero-view';
import ImageGrid from './image-grid';
import TokenDetailsModal from './token-details-modal';

class GMView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDetailModal: false,
      clickedImage: null
    };

    this.onGMGridClick = this.onGMGridClick.bind(this);
  }

  onGMGridClick(image) {
    switch (image.category) {
      case 'Environment':
        this.props.updateEnvironmentImage(image);
        break;
      case 'Secondary':
        this.setState({
          showDetailModal: true,
          clickedImage: image
        });
    }
  }

  render() {

    return (
      <div className="gm-view row no-gutters h-100 w-100">
        <div className="hero-view-container col-8">
          { this.state.showDetailModal &&
        <TokenDetailsModal
          token={this.state.clickedImage}
          clearModal={() => { this.setState({ showDetailModal: false, clickedImage: null }); }}
          addToken={this.props.addToken}/>}
          <HeroView
            session={this.props.config.gameSession.session}
            isGM={true}
            clearEnvironmentImage={this.props.clearEnvironmentImage}
            removeToken={this.props.removeToken}
            clearAllTokens={this.props.clearAllTokens}/>
        </div>
        <div className="image-grid-container col-4">
          <ImageGrid
            onGridClick={this.onGMGridClick}
            campaignAssets={this.props.config.gameSession.campaignAssets}
            setCampaign={this.props.setCampaign}
            gmView={{ campaignId: this.props.config.gameSession.campaignId }}/>
        </div>
      </div>
    );
  }
}

export default GMView;
