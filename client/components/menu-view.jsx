const React = require('react');

class MenuView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: 'chooseRole'
    };

    this.goToPlayerSessionView = this.goToPlayerSessionView.bind(this);
  }

  goToPlayerSessionView() {
    fetch('/api/allsessions', { method: 'GET' })
      .then(res => res.json())
      .then(jsonRes => jsonRes);
    this.setState({ currentMenu: 'playerChooseSession' });
  }

  render() {
    let currentMenu;

    switch (this.state.currentMenu) {
      case 'chooseRole':
        currentMenu = <UserChooseRole
          goToPlayerSessionView={this.goToPlayerSessionView}
          goToSessionView={this.props.goToSessionView}/>;
        break;
      case 'playerChooseSession':
        currentMenu = <PlayerChooseSession playerJoinSession={this.props.playerJoinSession}/>;
        break;
    }

    return (
      <div className="view-body d-flex justify-content-center align-items-center">
        {currentMenu};
      </div>
    );
  }
}

function UserChooseRole(props) {

  return (
    <div className="menu-container h-75 w-25 bg-dark rounded d-flex flex-column justify-content-center p-4">
      <h5 className="text-light text-center">Choose Your Role</h5>
      <button onClick={props.goToSessionView} className="btn btn-secondary mb-4">Game Master</button>
      <button onClick={props.goToPlayerSessionView} className="btn btn-secondary mb-4">Player</button>
    </div>
  );
}

function PlayerChooseSession(props) {

  return (
    <div className="menu-container h-75 w-25 bg-dark rounded d-flex flex-column justify-content-center p-4">
      <h5 className="text-light text-center">Join Session</h5>
      <div className="bg-light text-dark h-75 p-2">
        <p onClick={props.playerJoinSession}>Landing on Nar Shadda</p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary">Join Session</button>
      </div>
    </div>

  );
}

module.exports = MenuView;
