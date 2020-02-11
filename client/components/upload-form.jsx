import React from 'react';

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
      <div className="upload-form-container h-100 w-100">
        <form onSubmit={this.props.onUploadSubmit} id="upload-file" className="upload-form row no-gutters h-100 w-100 border border-secondary rounded">
          <div className="row no-gutters form-group p-2 m-0 col-12 align-items-center">
            <div className="col row no-gutters file-browse align-items-center justify-content-around">
              <div className="col-9">
                <label id="filepath-label" className="custom-file-label text-truncate m-0 w-100" htmlFor="image-upload">{filePathLabel}</label>
                <input required type="file" className="custom-file-input w-100" name="image-upload" onChange={this.onChange} />
              </div>
              <button type="submit" className="upload-form-submit col-2 btn btn-outline-success"><i className="fas fa-file-upload"></i></button>
            </div>
          </div>
          <div className="row no-gutters form-group m-0 px-2 col-12 align-items-center justify-content-around">
            <div className="col row no-gutters p-2 align-items-center">
              <label className="text-white col-form-label mr-2" htmlFor="alias">Alias</label>
              <input required className="col form-control pl-2" id="alias" name="alias" placeholder="Your name for this image" />
            </div>
            <div className="col row no-gutters m-0 form-group align-items-center">
              <label htmlFor="category" className="text-white col-form-label mr-2">Category</label>
              <div className="col">
                <select required name="category" id="category" className="form-control">
                  <option></option>
                  <option>Environment</option>
                  <option>Secondary</option>
                </select>
              </div>
            </div>
          </div>
          <input type="hidden" name="campaignId" value={this.props.campaignId}/>
        </form>
      </div>
    );
  }
}

export default UploadForm;
