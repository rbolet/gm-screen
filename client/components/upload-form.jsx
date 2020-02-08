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
    return (
      <div className="upload-form-container h-100 w-100">
        <form onSubmit={this.props.onUploadSubmit} id="upload-file" className="upload-form row no-gutters h-100 w-100">
          <div className="row no-gutters form-group px-2 col-12">
            <div className="col-3 row no-gutters file-browse p-2 align-items-center">
              <input required type="file" className="custom-file-input" id="hidden-file-input" name="image-upload" onChange={this.onChange} />
              <button className="btn btn-secondary position-absolute" id="browse-button">Choose File</button>
            </div>
            <div className="col-9 row no-gutters p-2 align-items-center">
              <label className="text-white mr-2 col-form-label" htmlFor="alias">Image Name</label>
              <input required className="col form-control" id="alias" name="alias" placeholder="Your name for this image" />
            </div>
          </div>
          <div className="row no-gutters form-group px-2 col-12 align-items-center justify-content-around">
            <div className="col-9 row form-group align-items-center">
              <label htmlFor="category" className="text-white col-form-label">Category</label>
              <div className="col">
                <select required name="category" id="category" className="form-control">
                  <option></option>
                  <option>Environment</option>
                  <option>Secondary</option>
                </select>
              </div>
            </div>
            <input type="submit" value="Upload" className="btn btn-outline-light col-3 form-group" />
          </div>
          <input type="hidden" name="campaignId" value={this.props.campaignId}/>
        </form>
      </div>
    );
  }
}

export default UploadForm;
