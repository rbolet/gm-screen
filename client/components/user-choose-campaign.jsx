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
      fetch('/activeCampaigns', { method: 'GET' })
        .then(res => res.json())
        .then(campaignList => {
          this.setState({ campaignList });
        });
    }

  }

  render() {
    let ButtonFooter;
    if (this.props.config.user.userRole === 'gm') {
      ButtonFooter = (
        <div className="">
          <button type="button" className="btn btn-outline-light">New</button>
          <button type="button" className="btn btn-secondary" onClick={() => this.props.setCampaign(this.state.selectedCampaign)}>Select</button>
        </div>
      );
    }
    return (
      <div className="user-choose-campaign d-flex flex-column justify-content-center col-3 bg-dark rounded">
        <h5 className="text-light text-center">{`${this.props.config.user.userId === 'gm' ? 'Choose' : 'Join'} Campaign`}</h5>
        <div className="bg-light text-dark h-50 mb-3" id="menu-campaign-list">
          <table className="m-0 w-100">
            <CampaignList campaignList={this.state.campaignList} onClick={this.highlightRow} className="px-2 pt-2 list-display" />
          </table>
        </div>
        {ButtonFooter}
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
          className={`list-display w-100 ${props.selectedRow === campaign.campaignId ? 'selected' : ''}`}
          onClick={props.onClick.bind(this, campaign)}>
          <td className="p-2">{campaign.campaignName}</td>
        </tr>
      );
    });
    return <tbody>{CampaignRows}</tbody>;
  }
}

export default UserChooseCampaign;
