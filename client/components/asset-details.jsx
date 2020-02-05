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
          <div className="input-group mb-3 px-3">
            <input type="text" readOnly className="form-control" value={this.props.assetImage ? this.props.assetImage.alias : ''}/>
            <div className="input-group-append">
              <button type="button" className="btn btn-secondary">Edit</button>
            </div>
          </div>
          <button type="button" onClick={this.props.launchSession} className="btn btn-lg btn-success">Launch Session</button>
        </div>
      </div>
    );
  }
}

export default AssetDetails;
