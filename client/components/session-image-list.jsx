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
        <div className="all-images-header text-white text-center mt-2">My Session</div>
        <div className="all-images-body rounded bg-light h-75">
          <div className="transparent h-50"></div>
          <div className="upload-slidedown color-quartz p-0">
            <div className="d-flex justify-content-center">
              <button className="btn" type="submit">Upload</button>
            </div>
            <form className="invisible" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input className="form-control" type="text"/>
              </div>
              <div className="custom-file">
                <input type="file" className="custom-file-input" id="customFile"/>
                <label className="custom-file-label" htmlFor="customFile">Choose file</label>
              </div>
            </form>
          </div>
          <table className="table images-table">
            <SessionImage
              images={this.props.images}
              selectedRow={this.state.selectedRowKey}
              onClick={this.onRowClick}
            />
          </table>
        </div>
        <div className="all-images-footer rounded d-flex w-100 color-quartz p-2">
          <button className="btn btn-outline-light">Upload File</button>
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
