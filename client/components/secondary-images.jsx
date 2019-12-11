const React = require('react');

function SecondaryImages(props) {
  let closeButton = null;
  if (props.gmClick) {
    closeButton = (
      <div className="close m-1 d-inline">
        <i className="fa fa-times-circle" onClick={props.gmClick}></i>
      </div>
    );
  }
  return (
    <div className="secondary-images-container">
      <div className="secondary-images h-100 d-inline-flex justify-content-center" id={props.id ? props.id : ''}>
        <SecondaryImage
          secondaryImagesArray={props.secondaryImagesArray}
          removeOneImage={props.removeOneImage}/>
      </div>
      {closeButton}
    </div>
  );
}

function SecondaryImage(props) {
  let closeButton = null;
  if (props.removeOneImage) {
    closeButton = (
      <div className="close m-1 d-inline">
        <i className="fa fa-times-circle" onClick={props.removeOneImage}></i>
      </div>
    );
  }
  const imageElements = props.secondaryImagesArray.map(fileName => {
    return (
      <div
        key={fileName}
        style={{ backgroundImage: `url(./images/${fileName})` }}
        className="secondary-image mx-2">
        {closeButton}
      </div>
    );
  });
  return imageElements;
}

module.exports = SecondaryImages;
