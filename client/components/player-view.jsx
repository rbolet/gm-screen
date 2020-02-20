import React from 'react';
import HeroView from './hero-view';
import TokenDetailsModal from './token-details-modal';

class PlayerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedToken: null,
      showDetailModal: false
    };
    this.openModal = this.openModal.bind(this);
  }

  openModal(token) {
    this.setState({
      selectedToken: token,
      showDetailModal: true
    });
  }

  render() {
    return (
      <div className="player-view row no-gutters h-100 w-100">
        <div className="hero-view-container col-12">
          {this.state.showDetailModal &&
          <TokenDetailsModal
            token={this.state.selectedToken}
            clearModal={() => { this.setState({ selectedToken: null, showDetailModal: false }); }}
            isGM={false} />}
          <HeroView session={this.props.config.gameSession.session} tokenDetails={this.openModal}/>
        </div>
      </div>
    );
  }
}

export default PlayerView;
