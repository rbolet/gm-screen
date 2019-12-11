const React = require('react');

function SecondaryImages(props) {
  let closeButton = null;
  if (props.gmClick) {
    closeButton = (
      <div className="close m-1">
        <i className="fa fa-times-circle" onClick={props.gmClick}></i>
      </div>
    );
  }
  return (
    <div className="secondary-images-container d-flex justify-content-center" id={props.id ? props.id : ''}>
      <SecondaryImage secondaryImagesArray={props.secondaryImagesArray}/>
      {closeButton}
    </div>
  );
}

function SecondaryImage(props) {
  const imageElements = props.secondaryImagesArray.map(fileName => {
    return (
      <img
        key={fileName}
        src={`./images/${fileName}`}
        className="secondary-image mx-2"/>
    );
  });
  return imageElements;
}

module.exports = SecondaryImages;
