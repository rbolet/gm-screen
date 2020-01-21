const React = require('react');

class Header extends React.Component {
  render() {
    return (
      <div>
        <header className="app-header bg-dark">
          <div onClick={this.props.returnToMenu} className="btn btn-secondary">Main Menu</div>
          <div>{this.props.user}</div>
          <div>{this.props.session && `Session: ${this.props.session}`}</div>
        </header>
      </div>
    );
  }
}

module.exports = Header;
