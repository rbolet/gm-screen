const React = require('react');

class SecondaryImages extends React.Component {
  render() {
    return (
      <div className="secondary-images-container d-flex justify-content-center">
        <SecondaryImage secondaryImagesArray={this.props.secondaryImagesArray}/>
      </div>
    );
  }
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
