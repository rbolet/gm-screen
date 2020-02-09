import React from 'react';

class UserChooseCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignList: [],
      selectedCampaign: null,
      showModal: false
    };

    this.highlightRow = this.highlightRow.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

  }

  highlightRow(campaign) {
    event.target.classList.toggle('selected');
    this.setState({ selectedCampaign: campaign });
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  refreshList() {
    if (this.props.config.user.userRole === 'gm') {
      const requestBody = JSON.stringify({ userId: this.props.config.user.userId });
      fetch('/gmCampaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      })
        .then(res => res.json())
        .then(campaignList => {
          this.setState({ campaignList });
        });

    } else {
      fetch('/activeGameSessions', { method: 'GET' })
        .then(res => res.json())
        .then(campaignList => {
          this.setState({ campaignList });
        });
    }
  }

  componentDidMount() {
    this.refreshList();
  }

  render() {
    return (
      <div className="user-choose-campaign d-flex flex-column justify-content-center col-3 bg-dark rounded">
        {this.state.showModal && <NewCampaignModal toggleModal={this.toggleModal} newCampaign={this.props.newCampaign}/>}
        <div className="menu-box-header h-25 d-flex align-items-center justify-content-center">
          <h5 className="text-light text-center">{`${this.props.config.user.userRole === 'gm' ? 'Choose' : 'Join'} Campaign`}</h5>
        </div>
        <div className="bg-light text-dark h-50 mb-3 rounded" id="menu-campaign-list">
          <table className="m-0 w-100" id="campaign-list">
            <CampaignList campaignList={this.state.campaignList} onClick={this.highlightRow} className="px-2 pt-2 list-display" />
          </table>
        </div>
        <div className="menu-box-footer d-flex align-items-center h-25 w-100">
          <div className="d-flex justify-content-between w-100 px-2">
            <button type="button" className="btn btn-outline-light w-25"
              onClick={this.props.config.user.userRole === 'gm' ? this.toggleModal : this.refreshList}>
              <i className={`fas ${this.props.config.user.userRole === 'gm' ? 'fa-plus-circle' : 'fa-redo-alt'}`} />
            </button>
            {this.props.config.user.userRole === 'gm' && <button type="button" className="btn btn-secondary w-25" onClick={() => { this.props.setCampaign(this.state.selectedCampaign); }}><i className="fas fa-file-upload"></i></button>}
            <button type="button" className="btn btn-success w-25" onClick={() => { this.props.setCampaign(this.state.selectedCampaign, true); }}><i className="fas fa-play"></i></button>
          </div>
        </div>
      </div>
    );
  }
}

function CampaignList(props) {
  if (!props.campaignList) {
    return null;
  } else {
    const CampaignRows = props.campaignList.map(campaign => {
      return (
        <tr
          key={campaign.campaignId}
          className={'list-display w-100'}
          onClick={props.onClick.bind(this, campaign)}>
          <td className="p-2">{campaign.campaignName}</td>
        </tr>
      );
    });
    return <tbody>{CampaignRows}</tbody>;
  }
}

class NewCampaignModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignName: ''
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.setState({ campaignName: event.target.value });
  }

  render() {
    return (
      <div className="new-campaign-modal backdrop-blur">
        <div className="modal-content w-25 bg-dark text-light">
          <div className="modal-header position-relative">
            <h5 className="modal-title text-center">Add New Campaign</h5>
            <div className="close d-flex">
              <i className="fa fa-times" onClick={this.props.toggleModal} />
            </div>
          </div>
          <div className="modal-body">
            <input type="text" onChange={this.onChange} className="new-campaign-input form-control" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-success w-25" onClick={this.props.newCampaign.bind(this, this.state.campaignName)}><i className="fas fa-plus-circle" /></button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserChooseCampaign;
