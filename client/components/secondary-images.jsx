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
    <div className={`secondary-images-container ${(props.secondaryImagesArray.length) ? 'backdrop-blur' : ''}`} id={props.id ? props.id : ''}>
      <div className="secondary-images h-100 d-inline-flex justify-content-center" >
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
  const imageElements = props.secondaryImagesArray.map(image => {
    if (props.removeOneImage) {
      closeButton = (
        <div className="close m-1 d-inline">
          <i className="fa fa-times" onClick={props.removeOneImage.bind(this, image.fileName)}></i>
        </div>
      );
    }
    return (
      <div
        key={image.fileName + image.randomKey}
        style={{ backgroundImage: `url(./images/${image.fileName})` }}
        className="secondary-image mx-2">
        {closeButton}
        <div className="secondary-footer"></div>
      </div>
    );
  });
  return imageElements;
}

module.exports = SecondaryImages;
