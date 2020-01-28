const React = require('react');
const UserLogin = require('./user-login');

class MenuView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: 'chooseRole'
    };

    this.chooseSession = this.chooseSession.bind(this);
  }

  chooseSession(role) {
    switch (role) {
      case 'gm' :
        this.setState({ currentMenu: 'gmChooseSession' });
        break;
      case 'player':
        this.setState({ currentMenu: 'playerChooseSession' });
        break;
    }

  }

  render() {
    let currentMenu;
    if (!this.props.playerConfig.userId) {
      currentMenu = <UserLogin
        loginUser={this.props.loginUser}
        playerConfig={this.props.playerConfig}
        newUser={this.props.newUser}/>;
    } else {
      switch (this.state.currentMenu) {
        case 'chooseRole':
          currentMenu = <UserChooseRole
            chooseSession={this.chooseSession}
            goToSessionView={this.props.goToSessionView}/>;
          break;
        case 'playerChooseSession':
          currentMenu = <PlayerChooseSession playerJoinSession={this.props.playerJoinSession}/>;
          break;
        case 'gmChooseSession':
          currentMenu = <GMChooseSession
            goToSessionView={this.props.goToSessionView}
            playerConfig={this.props.playerConfig}/>;
          break;
      }
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
      <button onClick={() => props.chooseSession('gm')} className="btn btn-secondary mb-4">Game Master</button>
      <button onClick={() => props.chooseSession('player')} className="btn btn-secondary mb-4">Player</button>
    </div>
  );
}

class PlayerChooseSession extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sessionList: [],
      selectedSession: null
    };

    this.highlightRow = this.highlightRow.bind(this);
  }

  highlightRow(session) {
    event.target.classList.toggle('selected');
    this.setState({ selectedSession: session });
  }

  componentDidMount() {
    fetch('/launchedSessions', { method: 'GET' })
      .then(res => res.json())
      .then(sessionList => {
        this.setState({ sessionList });
      });
  }

  render() {
    return (
      <div className="container h-100">
        <h5 className="text-light text-center">Join Session</h5>
        <div className="bg-light text-dark h-75 " id="menu-session-list">
          <table className="m-0 w-100">
            <SessionList sessionList={this.state.sessionList} onClick={this.highlightRow} className="px-2 pt-2 list-display"/>
          </table>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={this.props.playerJoinSession.bind(this, this.state.selectedSession)}>Join Session</button>
        </div>
      </div>
    );
  }
}

class GMChooseSession extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sessionList: [],
      selectedSession: null
    };

    this.highlightRow = this.highlightRow.bind(this);
  }

  highlightRow(session) {
    event.target.classList.toggle('selected');
    this.setState({ selectedSession: session });
  }

  componentDidMount() {
    const gmSessionsBody = JSON.stringify({ userId: this.props.playerConfig.userId });

    fetch('/gmSessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: gmSessionsBody
    })
      .then(res => res.json())
      .then(sessionList => {
        this.setState({ sessionList });
      });
  }

  render() {
    return (
      <div className="container h-100">
        <h5 className="text-light text-center">Join Session</h5>
        <div className="bg-light text-dark h-75 " id="menu-session-list">
          <table className="m-0 w-100">
            <SessionList sessionList={this.state.sessionList} onClick={this.highlightRow} className="px-2 pt-2 list-display" />
          </table>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={this.props.goToSessionView.bind(this, this.state.selectedSession)}>Choose Session</button>
        </div>
      </div>
    );
  }
}

function SessionList(props) {
  const elementRows = props.sessionList ? props.sessionList.map(session => {
    return (
      <tr
        key={session.sessionId}
        className={`list-display w-100 ${props.selectedRow === session.sessionId ? 'selected' : ''}`}
        onClick={props.onClick.bind(this, session)}>
        <td className="p-2">{session.sessionName}</td>
      </tr>
    );
  })
    : null;
  return (
    <tbody>{elementRows}</tbody>);
}

module.exports = MenuView;
