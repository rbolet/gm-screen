import React from 'react';
import LaunchSession from './launch-session';

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
      <LaunchSession connectSocket={props.connectSocket}/>
    </div>
  );
}

export default AssetDetails;
