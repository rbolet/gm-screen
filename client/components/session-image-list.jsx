const React = require('react');

class SessionImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKey: null
    };

    this.onRowClick = this.onRowClick.bind(this);
  }

  onRowClick(image) {
    this.setState({ selectedRowKey: image.imageId });
    this.props.changeThumbnail(image);
  }

  render() {
    return (
      <div className="col h-100 d-inline-block">
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
        className={props.selectedRow === image.imageId ? 'selected text-white' : ''}
        onClick={props.onClick.bind(this, image)}>
        <td>{image.userGivenName}</td>
      </tr>
    );
  });
  return (<tbody>{elementRows}</tbody>);
}
