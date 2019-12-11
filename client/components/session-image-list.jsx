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
        <div className="all-images-body rounded bg-light h-50">
          <div className="d-flex justify-content-center">
            <table className="table images-table">
              <SessionImage
                images={this.props.images}
                selectedRow={this.state.selectedRowKey}
                onClick={this.onRowClick}
              />
            </table>
          </div>
        </div>
        <div className="all-images-footer rounded d-flex w-100 color-quartz p-2">
          <SessionImageFooter
            showForm={this.props.showForm}
            onUploadSubmit={this.props.onUploadSubmit}/>
        </div>
      </div>
    );
  }
}

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

function SessionImageFooter(props) {
  if (props.showForm) {
    return (
      <UploadForm onUploadSubmit={props.onUploadSubmit}/>
    );
  }
  return null;
}

function UploadForm(props) {

  return (
    <form onSubmit={props.onUploadSubmit}>
      <div className="custom-file form-group">
        <div className="row">
          <label className="custom-file-label p-1" htmlFor="image-upload">Choose file</label>
          <input type="file" className="custom-file-input mb-1" id="image-upload" name="image-upload" />
        </div>
        <div className="row">
          <div className="col">
            <label className="text-white mb-0" htmlFor="given-name">Image Name</label>
            <input className="form-control mb-1" id="given-name" name="given-name" placeholder="Your name for this image"/>
          </div>
          <div className="col">
            <label htmlFor="category" className="text-white mb-0">Category</label>
            <input type="text" className="form-control mb-1" id="category" name="category"/>
          </div>
        </div>
        <input type="submit" value="Upload File" />
      </div>
    </form>
  );
}

module.exports = SessionImageList;
