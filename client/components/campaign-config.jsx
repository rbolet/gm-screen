import React from 'react';
import ImageGrid from './image-grid';
import UploadForm from './upload-form';

class CampaignConfig extends React.Component {

  onGridClick() {

  }

  render() {
    return (
      <div className="campaign-config row container h-100 align-items-center">
        <div className="col-6 row container campaign-images bg-dark rounded">
          <div className="col-12 h-75 row">
            <ImageGrid onGridClick={this.onGridClick} campaignAssets={this.props.config.gameSession.campaignAssets}/>
          </div>
          <div className="col-12 h-25 row">
            <UploadForm campaignId={this.props.config.gameSession.campaignId} onUploadSubmit={this.props.onUploadSubmit}/>
          </div>
        </div>
        <div className="col-6 campaign-image-details h-100"></div>
      </div>
    );
  }
}

export default CampaignConfig;
