import React from 'react';

class AssetDetails extends React.Component {
  render() {
    return (
      <div className="col-12 h-100">
        <div className="row no-gutters h-75 detail-image rounded bg-light p-3 d-flex justify-content-center">
          {this.props.assetImage &&
            <img className="img-thumbnail mh-100" src={`./images/${this.props.assetImage}`}/>}
        </div>
        <div className="detail-footer row"></div>
      </div>
    );
  }
}

export default AssetDetails;
