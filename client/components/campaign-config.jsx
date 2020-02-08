import React from 'react';
import ImageGrid from './image-grid';
import UploadForm from './upload-form';
import AssetDetails from './asset-details';

class CampaignConfig extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetImage: null
    };

    this.onGridClick = this.onGridClick.bind(this);
  }

  onGridClick(image) {
    this.setState({ assetImage: image });

  }

  render() {
    return (
      <div className="campaign-config row no-gutters h-100 w-100 align-items-center">
        <div className="col-6 row no-gutters campaign-images p-1">
          <div className="square bg-dark rounded">
            <div className="col-12 h-75 row no-gutters pt-1">
              <ImageGrid onGridClick={this.onGridClick} campaignAssets={this.props.config.gameSession.campaignAssets}/>
            </div>
            <div className="col-12 h-25 row no-gutters">
              <UploadForm campaignId={this.props.config.gameSession.campaignId} onUploadSubmit={this.props.onUploadSubmit}/>
            </div>
          </div>
        </div>
        <div className="col-6 row no-gutters campaign-asset-details p-1">
          <div className="square bg-dark rounded w-100 h-100 pt-3">
            <AssetDetails assetImage={this.state.assetImage} connectSocket={this.props.connectSocket}/>
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignConfig;
