import React from 'react';

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

export default LaunchSession;
