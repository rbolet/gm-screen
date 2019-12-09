const React = require('react');

class GMView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      environmentImage: '3d0e382a-7376-4802-9984-f936f4d04fbf..jpg'
    };
  }

  render() {

    return (
      <div className="view-body d-flex justify-content-center align-items-center">
        <div className="row h-100 w-100">
          <div className="col-6 h-100 border border-warning">
            <div className="h-75 border border-success">
              <div className="environment-image h-100 w-100" style={`"background-image: url(../server/public/images/${this.state.environmentImage});"`}></div>
            </div>
            <div className="h-25 border border-success"></div>
          </div>
          <div className="col-6 h-100 border border-warning"></div>
        </div>
      </div>
    );
  }
}

module.exports = GMView;
