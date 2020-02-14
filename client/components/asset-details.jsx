import React from 'react';

class AssetDetails extends React.Component {
  render() {
    return (
      <div className="col-12 h-100">
        <div className="row no-gutters h-75 detail-image rounded bg-light p-3 d-flex justify-content-center">
          {this.props.assetImage &&
            <img className="img-thumbnail mh-100" src={`./images/${this.props.assetImage.fileName}`}/>}
        </div>
        <div className=" h-25 detail-footer justify-content-center align-items-center row">
          <button type="button" onClick={this.props.connectSocket} className="btn btn-lg btn-success justify-self-end w-25">
            <i className="fas fa-play"/>
            <p className="button-text m-0">Launch Session</p>
          </button>
        </div>
      </div>
    );
  }
}

export default AssetDetails;
