const React = require('react');

function SessionImageList(props) {

  return (
    <div className="col-4 h-100">
      <div className="all-images-header text-white text-center">My Session</div>
      <div className="all-images-body bg-light h-75">
        <table className="table">
          <thead>
            <tr>
              <td>File Name</td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}

module.exports = SessionImageList;
