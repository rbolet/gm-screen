const React = require('react');

function SecondaryImages(props) {
  return (
    <div className="secondary-images-container d-flex justify-content-center" id={props.id ? props.id : ''}>
      <SecondaryImage secondaryImagesArray={props.secondaryImagesArray}/>
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
