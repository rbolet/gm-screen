const React = require('react');

class SecondaryImages extends React.Component {
  render() {
    return (
      <div className="secondary-images-container d-flex justify-content-center">
        <img className="secondary-image mx-2" src="/images/2f75c236-97f2-4e85-a56e-c9ca502b2c3e..jpg" alt=""/>
        <img className="secondary-image mx-2" src="/images/9841ffcb-7aba-49e8-b0f6-809b8438b381..jpg" alt=""/>
        <img className="secondary-image mx-2" src="/images/ec1442ff-dbcb-4372-8e13-8bd1f982c2d0..png" alt=""/>
      </div>
    );
  }
}

module.exports = SecondaryImages;
