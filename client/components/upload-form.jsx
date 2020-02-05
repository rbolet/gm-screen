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
      <div className="upload-form pl-2 h-100">
        <form onSubmit={this.props.onUploadSubmit} id="upload-file">
          <div className="row col-12">
            <div className="col-4">
              <label id="filepath-label" className="custom-file-label text-truncate p-1" htmlFor="image-upload"></label>
              <input required type="file" className="custom-file-input mb-1" id="image-upload" name="image-upload" onChange={this.onChange} />
            </div>
            <div className="col-8">
              <label className="text-white mb-0" htmlFor="alias">Image Name</label>
              <input required className="form-control mb-1" id="alias" name="alias" placeholder="Your name for this image" />
            </div>
          </div>
          <div className="row col-12">
            <label htmlFor="category" className="text-white mb-0">Category</label>
            <div className="col-6">
              <select required name="category" id="category" className="form-control mb-1">
                <option></option>
                <option>Environment</option>
                <option>Secondary</option>
              </select>
            </div>
            <input type="submit" value="Upload File" className="btn btn-secondary" />
          </div>
          <input type="hidden" name="campaignId" value={this.props.campaignId}/>
        </form>
      </div>
    );
  }
}

export default UploadForm;
