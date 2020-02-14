import React from 'react';

function AssetDetails(props) {
  let FeaturedAsset = null;
  if (props.assetImage) {
    FeaturedAsset = <img className="img-thumbnail mh-100" src={`./images/${props.assetImage.fileName}`}/>;
  } else {
    FeaturedAsset = (
      <div className="img-thumbnail mh-100 text-muted">
        Select an image from the grid
      </div>
    );
  }
  return (
    <div className="col-12 h-100">
      <div className="row no-gutters h-75 detail-image rounded bg-light p-3 d-flex justify-content-center align-items-center">
        {FeaturedAsset}
      </div>
      <div className=" h-25 detail-footer justify-content-center align-items-center row">
        <button type="button" onClick={props.connectSocket} className="btn btn-lg btn-success justify-self-end w-25">
          <i className="fas fa-play"/>
          <p className="button-text m-0">Launch Session</p>
        </button>
      </div>
    </div>
  );
}

export default AssetDetails;
