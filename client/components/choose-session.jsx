const React = require('react');

class ChooseSession extends React.Component {

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
    fetch('/allsessions', { method: 'GET' })
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
          <button type="button" className="btn btn-secondary" onClick={this.props.playerJoinSession.bind(this, this.state.selectedSession)}>Join Session</button>
        </div>
      </div>
    );
  }
}

function SessionList(props) {

  const elementRows = props.sessionList.map(session => {
    return (
      <tr
        key={session.sessionId}
        className={`list-display w-100 ${props.selectedRow === session.sessionId ? 'selected' : ''}`}
        onClick={props.onClick.bind(this, session)}>
        <td className="p-2">{session.sessionName}</td>
      </tr>
    );
  });
  return (
    <tbody>{elementRows}</tbody>);
}

module.exports = ChooseSession;
