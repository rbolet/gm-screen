const React = require('react');

function SessionImageList(props) {

  return (
    <div className="col-4 h-100">
      <div className="all-images-header text-white text-center">My Session</div>
      <div className="all-images-body bg-light h-75">
        <table className="table">
          <thead>
            <tr>
              <th>File Name</th>
            </tr>
          </thead>
          <SessionImage images={props.images}/>
        </table>
      </div>
    </div>
  );
}

module.exports = SessionImageList;

function SessionImage(props) {

  const elementRows = props.images.map(image => {
    return (
      <tr key={image.imageId}>
        <td>{image.filename}</td>
      </tr>
    );
  });
  return (<tbody>{elementRows}</tbody>);
}
