import React from 'react';

function AssetDetails(props) {
  let Asset = null;
  if (props.assetImage) {
    Asset = <FeaturedAsset assetImage={props.assetImage}/>;
  } else {
    Asset = (
      <div className="img-thumbnail mh-100 text-muted">
        Select an image from the grid
      </div>
    );
  }
  return (
    <div className="col-12 h-100">
      <div className="row no-gutters h-75 detail-image rounded bg-light p-3 d-flex justify-content-center align-items-center">
        {Asset}
      </div>
      <LaunchSession connectSocket={props.connectSocket}/>
    </div>
  );
}

function FeaturedAsset(props) {
  return (
    <div className="w-100 h-100 container">
      <div className="row">
        <div className="thumbnail h-100 col-6">
          <img className="img-thumbnail mh-100" src={`./images/${props.assetImage.fileName}`} />
        </div>
        <div className="col-6">
          <div className="row w-100">
            <input type="text" name="asset-name" id="asset-name" value="mmmmmmmmmmmmmmmmmmmm" readOnly />
          </div>
          <div className="row w-100">
            <textarea name="asset-text" id="asset-text" value="This would be hold a long description, or maybe some stats etc etc"/>
          </div>
        </div>
      </div>
    </div>
  );

}

function LaunchSession(props) {
  return (
    <div className=" h-25 detail-footer justify-content-center align-items-center row">
      <button type="button" onClick={props.connectSocket} className="btn btn-lg btn-success justify-self-end w-25">
        <i className="fas fa-play" />
        <p className="button-text m-0">Launch Session</p>
      </button>
    </div>
  );
}

export default AssetDetails;
