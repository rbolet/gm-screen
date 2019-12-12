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
      <div className="col h-100 d-inline-block color-quartz rounded mx-1">
        <div className="all-images-header text-white text-center mt-2">My Session</div>
        <div className="all-images-body rounded bg-light h-50 mx-1">
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
        <div className="all-images-footer rounded d-flex w-100 h-25 p-2">
          <SessionImageFooter
            showForm={this.props.showForm}
            onUploadSubmit={this.props.onUploadSubmit}
            className="flex-container"/>
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
        <td>{image.category}</td>
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

class UploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePathDisplay: ''
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ filePathDisplay: event.target.value });
  }

  render() {

    const filePathLabel = this.state.filePathDisplay ? this.state.filePathDisplay : 'Choose a file';

    return (
      <div className="d-flex row align-items-center w-100 mx-auto mt-4">
        <form onSubmit={this.props.onUploadSubmit} id="upload-file">
          <div className="custom-file form-group">
            <div className="row">
              <label className="custom-file-label text-truncate p-1" htmlFor="image-upload">{filePathLabel}</label>
              <input required type="file" className="custom-file-input mb-1" id="image-upload" name="image-upload" onChange={this.onChange}/>
            </div>
            <div className="row">
              <div className="col">
                <label className="text-white mb-0" htmlFor="given-name">Image Name</label>
                <input required className="form-control mb-1" id="given-name" name="given-name" placeholder="Your name for this image"/>
              </div>
              <div className="col">
                <label htmlFor="category" className="text-white mb-0">Category</label>
                <select required name="category" id="category" className="form-control mb-1">
                  <option></option>
                  <option>Environment</option>
                  <option>Secondary</option>
                </select>
              </div>
            </div>
            <div className="pt-3">
              <input type="submit" value="Upload File" className="btn btn-secondary" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

module.exports = SessionImageList;
