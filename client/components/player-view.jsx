const React = require('react');

class PlayerView extends React.Component {
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
          <div className="col-12 h-100 border border-warning">
            <div className="h-100 p-2 border border-success">
              <div className="environment-image h-100 w-100" style={{ backgroundImage: `url(./images/${this.state.environmentImage})` }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = PlayerView;
