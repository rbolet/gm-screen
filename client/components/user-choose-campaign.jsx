import React from 'react';

class UserChooseCampaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignList: [],
      selectedCampaign: null
    };

    this.highlightRow = this.highlightRow.bind(this);
  }

  highlightRow(campaign) {
    event.target.classList.toggle('selected');
    this.setState({ selectedCampaign: campaign });
  }

  selectCampaign() {
    if (this.props.config.user.userRole === 'gm') {
      this.props.setCampaign(this.state.selectedCampaign);
    } else {
      this.props.joinSession(this.state.selectedCampaign);
    }
  }

  componentDidMount() {
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

  render() {
    return (
      <div className="user-choose-campaign d-flex flex-column justify-content-center col-3 bg-dark rounded">
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
            <button type="button" className="btn btn-outline-light w-25">
              <i className={`fas ${this.props.config.user.userRole === 'gm' ? 'fa-plus-circle' : 'fa-redo-alt'}`} />
            </button>
            {this.props.config.user.userRole === 'gm' && <button type="button" className="btn btn-secondary w-25" onClick={() => { this.props.setCampaign(this.state.selectedCampaign); }}><i className="fas fa-cogs"/></button>}
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

export default UserChooseCampaign;
