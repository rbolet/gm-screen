const React = require('react');

function UserChooseRole(props) {

  return (
    <div className="container d-flex flex-column justify-content-center pt-5 mt-5">
      <h5 className="text-light text-center">Choose Your Role</h5>
      <button onClick={props.goToSessionView} className="btn btn-secondary mb-4">Game Master</button>
      <button onClick={props.goToPlayerSessionView} className="btn btn-secondary mb-4">Player</button>
    </div>
  );
}

module.exports = UserChooseRole;
