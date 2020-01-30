const React = require('react');

class GMFooterModal extends React.Component {
  render() {
    return (
      <div className="modal-background">
        <div className="modal-dialog w-50 h-50">
          <div className="modal-content bg-dark">
            <div className="close m-1 d-inline">
              <i className="fa fa-times" ></i>
            </div>
            <div className="modal-body">
              <div className="modal-image"
                style={{ backgroundImage: `url(./images/${this.props.image.fileName})` }}>
                <div className="secondary-detail-content"></div>
              </div>
            </div>
            <div className="modal-footer">
              <input type="text" name="name" id="detail-name"/>
              <button type="button" className="btn btn-secondary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = GMFooterModal;
