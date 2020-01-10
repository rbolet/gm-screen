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
        <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center p-2">
          <div className="title fade-loop text-center">GM Screen</div>
          <div className="menu-container h-75 w-25 bg-dark rounded p-4">
            {currentMenu};
          </div>
        </div>
      </div>
    );
  }
}

function UserChooseRole(props) {

  return (
    <div className="container d-flex flex-column justify-content-center pt-5 mt-5">
      <h5 className="text-light text-center">Choose Your Role</h5>
      <button onClick={props.goToSessionView} className="btn btn-secondary mb-4">Game Master</button>
      <button onClick={props.goToPlayerSessionView} className="btn btn-secondary mb-4">Player</button>
    </div>
  );
}

class PlayerChooseSession extends React.Component {

  highlightRow(event) {
    event.target.classList.toggle('selected');
  }

  render() {
    return (
      <div className="container h-100">
        <h5 className="text-light text-center">Join Session</h5>
        <div className="bg-light text-dark h-75 " id="menu-session-list">
          <div onClick={this.highlightRow} className="px-2 pt-2 list-display">Infiltrating the Outpost</div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={this.props.playerJoinSession}>Join Session</button>
        </div>
      </div>
    );
  }
}

module.exports = MenuView;
