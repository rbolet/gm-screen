const React = require('react');

class MenuView extends React.Component {
  render() {
    return (
      <div className="view-body d-flex justify-content-center align-items-center">
        <div className="menu-container h-75 w-25 bg-dark rounded d-flex flex-column justify-content-center p-4">
          <button className="btn btn-secondary mb-4">Game Master</button>
          <button className="btn btn-secondary mb-4">Player</button>
        </div>
      </div>
    );
  }
}

module.exports = MenuView;
