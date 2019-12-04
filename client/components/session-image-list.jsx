const React = require('react');

class SessionImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKey: null
    };

    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick(row) {
    this.setState({ selectedRowKey: row });
  }

  render() {
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
            <SessionImage
              images={this.props.images}
              selectedRow={this.state.selectedRowKey}
              onClick={this.onRowClick}
            />
          </table>
        </div>
      </div>
    );
  }
}

module.exports = SessionImageList;

function SessionImage(props) {

  const elementRows = props.images.map(image => {
    return (
      <tr
        key={image.imageId}
        className={props.selectedRow === image.imageId ? 'selected' : ''}
        onClick={props.onClick.bind(this, image.imageId)}>
        <td>{image.filename}</td>
      </tr>
    );
  });
  return (<tbody>{elementRows}</tbody>);
}
