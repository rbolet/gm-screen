import React from 'react';

class UserChooseCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignList: [],
      selectedCampaign: null,
      showNewCampaignModal: false,
      showConfirmDeleteModal: false
    };

    this.setSelectedCampaign = this.setSelectedCampaign.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.toggleNewCampaignModal = this.toggleNewCampaignModal.bind(this);
    this.toggleConfirmDeleteModal = this.toggleConfirmDeleteModal.bind(this);
    this.onDeleteCampaign = this.onDeleteCampaign.bind(this);

  }

  setSelectedCampaign(campaign) {
    this.setState({ selectedCampaign: campaign });
  }

  onDeleteCampaign() {
    const deletePromise = new Promise(resolve => {
      resolve(this.props.deleteCampaign(this.state.selectedCampaign));
    });
    deletePromise.then(() => {
      this.toggleConfirmDeleteModal();
      this.refreshList();
    });
  }

  toggleNewCampaignModal() {
    this.setState({ showNewCampaignModal: !this.state.showNewCampaignModal });
  }

  toggleConfirmDeleteModal(campaign) {
    if (campaign) {
      this.setState({
        selectedCampaign: campaign,
        showConfirmDeleteModal: !this.state.showConfirmDeleteModal
      });
    } else {
      this.setState({ showConfirmDeleteModal: !this.state.showConfirmDeleteModal });
    }
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
    let Headline = null;
    if (this.props.config.user.userRole === 'gm') {
      Headline = <h5 className="text-light text-center">
        Choose Campaign&nbsp;&nbsp;<span><i className="fas fa-hat-wizard text-danger" /></span></h5>;
    } else {
      Headline = <h5 className="text-light text-center">
        Join Campaign&nbsp;&nbsp;<span><i className="fas fa-dice text-warning" /></span></h5>;
    }

    return (
      <div className="user-choose-campaign d-flex flex-column justify-content-center col-4 bg-dark rounded">
        {this.state.showNewCampaignModal && <NewCampaignModal
          toggleNewCampaignModal={this.toggleNewCampaignModal}
          newCampaign={this.props.newCampaign}/>}
        {this.state.showConfirmDeleteModal && <ConfirmDeleteModal
          deleteCampaign={this.onDeleteCampaign}
          selectedCampaign={this.state.selectedCampaign}
          toggleConfirmDeleteModal={this.toggleConfirmDeleteModal}/>}
        <div className="menu-box-header h-25 d-flex align-items-center justify-content-center">
          {Headline}
        </div>
        <div className="bg-light text-dark h-50 mb-3 rounded" id="menu-campaign-list">
          <table className="m-0 w-100" id="campaign-list">
            <CampaignList className="px-2 pt-2 list-display"
              campaignList={this.state.campaignList}
              userRole={this.props.config.user.userRole}
              setSelectedCampaign={this.setSelectedCampaign}
              toggleConfirmDeleteModal={this.toggleConfirmDeleteModal}/>
          </table>
        </div>
        <div className="menu-box-footer d-flex align-items-center h-25 w-100">
          <div className="d-flex justify-content-between w-100 px-2">
            <button type="button" className="btn btn-outline-success w-25"
              onClick={this.props.config.user.userRole === 'gm' ? this.toggleNewCampaignModal : this.refreshList}>
              <i className={`fas ${this.props.config.user.userRole === 'gm' ? 'fa-plus-circle' : 'fa-redo-alt'}`} />
            </button>
            {this.props.config.user.userRole === 'gm' &&
            <button type="button" className="btn btn-secondary w-25"
              disabled={!this.state.selectedCampaign}
              onClick={() => { this.props.setCampaign(this.state.selectedCampaign); }}>
              <i className="fas fa-file-upload"/>
            </button>}
            <button type="button" className="btn btn-success w-25"
              disabled={!this.state.selectedCampaign}
              onClick={() => { this.props.setCampaign(this.state.selectedCampaign, true); }}>
              <i className="fas fa-play"/>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class CampaignList extends React.Component {
  constructor(props) {
    super(props);
    this.highlightRow = this.highlightRow.bind(this);
  }

  highlightRow(campaign) {
    const tableRows = document.getElementById('campaign-table-body').children;
    for (let rowIndex = 0; rowIndex < tableRows.length; rowIndex++) {
      tableRows[rowIndex].classList.remove('selected');
    }
    event.target.parentElement.classList.add('selected');
    this.props.setSelectedCampaign(campaign);
  }

  render() {
    if (!this.props.campaignList) {
      return null;
    } else {
      const CampaignRows = this.props.campaignList.map(campaign => {
        return (
          <tr
            key={campaign.campaignId}
            className={'list-display w-100 border-bottom row-no-gutters'}
            onClick={this.highlightRow.bind(this, campaign)}>
            <td className="p-2 col">{campaign.campaignName}</td>
            <td className="d-flex justify-content-end col p-0 m-0">
              {this.props.userRole === 'gm' &&
                <button
                  className="btn btn-danger"
                  onClick={this.props.toggleConfirmDeleteModal.bind(this, campaign)}>
                  <i className="far fa-trash-alt text-white"/>
                </button>}
            </td>
          </tr>
        );
      });
      return <tbody id="campaign-table-body">{CampaignRows}</tbody>;
    }
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
              <i className="fa fa-times" onClick={this.props.toggleNewCampaignModal} />
            </div>
          </div>
          <div className="modal-body">
            <input type="text" onChange={this.onChange} className="new-campaign-input form-control" />
          </div>
          <div className="modal-footer">
            <button type="button" disabled={!this.state.campaignName}className="btn btn-success w-25" onClick={this.props.newCampaign.bind(this, this.state.campaignName)}><i className="fas fa-plus-circle" /></button>
          </div>
        </div>
      </div>
    );
  }
}

function ConfirmDeleteModal(props) {
  return (
    <div className="new-campaign-modal backdrop-blur">
      <div className="modal-content w-25 bg-dark text-light">
        <div className="modal-header position-relative bg-danger">
          <h5 className="modal-title text-center text-white">Confirm Delete</h5>
          <div className="close d-flex text-white">
            <i className="fa fa-times" onClick={props.toggleConfirmDeleteModal} />
          </div>
        </div>
        <div className="modal-body">
          <p>You&apos;re about to delete your Campaign &quot;<span>{props.selectedCampaign.campaignName}</span>&quot; and all its associated images</p>
        </div>
        <div className="modal-footer row no-gutters p-2">
          <p className="p-2 col m-0 text-right">Are you sure?</p>
          <button type="button" className="btn btn-danger" onClick={props.deleteCampaign}>
            <i className="far fa-trash-alt text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserChooseCampaign;
