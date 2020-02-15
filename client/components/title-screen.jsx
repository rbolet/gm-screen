import React from 'react';

class TitleScreen extends React.Component {
  render() {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
        <div className="title d-inline">GM-Screen</div>
        <div className="row justify-content-center w-100">
          <button className="start btn btn-dark fade-loop w-25" onClick={this.props.start}>Start</button>
          <div className="ml-3 text-white d-flex justify-content-center align-items-start" onClick={this.props.toggleHelpModal}>
            <i className="fas fa-info-circle info"></i>
          </div>
        </div>
      </div>
    );
  }
}

export default TitleScreen;
