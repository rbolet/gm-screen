import React from 'react';

class HelpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      lastPage: 5
    };

    this.turnPage = this.turnPage.bind(this);

  }

  turnPage(change) {

    let page = this.state.page + change;
    if (page < 1) page = this.state.page;
    if (page > this.state.lastPage) page = 1;
    this.setState({ page });
  }

  componentDidMount() {
    let context = 0;
    switch (this.props.view[0]) {
      case 'menu':
        switch (this.props.view[1]) {
          case 'title': context = 1; break;
          case 'login':
          case 'chooseRole':
            context = 2; break;
          case 'chooseCampaign': context = 3; break;
          default: context = 1; break;
        }
        break;
      case 'campaignConfig': context = 4; break;
      case 'gmView':
      case 'playerView':
        context = 5; break;
      default: context = 1;
    }
    this.setState({ page: context });
  }

  render() {
    let CurrentPage;
    switch (this.state.page) {
      case 1:
        CurrentPage = (
          <div className="page px-4">
            <h3 className="rakkas text-center w-100">Welcome to GM Screen</h3>
            <p>
              GM-Screen is not a game. It is an application to supplement the storytelling and enhance
              the immersion of traditional paper-and-dice role playing games,
              allowing Game Masters to share images in real time with the rest of the player group.
              Since GM-Screen does not use any game mechanics, it is useable with any system, game,
              or any situation imaginable where visual aids can add to a group&apos;s shared experience.
            </p>
            <div className="page-illustrations row no-gutters justify-content-center align-items-center flex-row">
              <div className="p-2 d-inline col">
                <img src="./assets/gmscreen_overview_help.png" className="img-fluid" />
              </div>
            </div>
          </div>
        );
        break;
      case 2:
        CurrentPage = (
          <div className="page">
            <div className="page-text px-4 row no-gutters">
              <p>
                Log in with your existing username and password,&nbsp;&nbsp;<span><i className="fas fa-sign-in-alt text-success"></i></span>&nbsp;&nbsp;
                or create a new one&nbsp;&nbsp;<span><i className="fas fa-user-plus text-secondary"></i></span>&nbsp;&nbsp;.
                <br /><br />Then, choose your Role: are you the Gamemaster  <span ><i className="fas fa-hat-wizard text-danger"></i></span>&nbsp;&nbsp;
                who will be choosing which visual information to share, or a Player<span >&nbsp;&nbsp;<i className="fas fa-dice text-warning"></i></span>&nbsp;&nbsp;
                receiving the information?
              </p>
            </div>
            <div className="page-illustrations row no-gutters justify-content-center align-items-center flex-row">
              <div className="p-2 d-inline col">
                <img src="./assets/gmscreen_userlogin_help.png" className="img-fluid"/>
              </div>
              <div className="p-2 d-inline col">
                <img src="./assets/gmscreen_chooserole_help.png" className="img-fluid"/>
              </div>
            </div>
          </div>
        );
        break;
      case 3:
        CurrentPage = (
          <div className="page">
            <div className="page-text px-4 row no-gutters">
              <p>
                Roleplaying games are played in Campaigns.
                If you are a Gamemaster, the Campaigns you have created will appear here.
                You can create a new Campaign,&nbsp;&nbsp;<span><i className="fas fa-plus-circle text-secondary"></i></span>&nbsp;&nbsp;
                configure an existing Campaign to upload to the library of images you can share,&nbsp;&nbsp;<span><i className="fas fa-file-upload text-secondary"></i></span>&nbsp;&nbsp;
                or skip straight to resuming your Campaign, picking up your Session where you last left off.&nbsp;&nbsp;<span><i className="fas fa-play text-success"></i></span><br/><br/>
                If you are a Player, only Campaigns with currently launched Sessions appear here;
                simply choose the Campaign your GM has directed you to join.&nbsp;&nbsp;<span><i className="fas fa-play text-success"></i></span>&nbsp;&nbsp;
                If it doesn&apos;t appear on the Campaign list yet, you can refresh the list at any time.&nbsp;&nbsp;<span><i className="fas fa-redo-alt text-secondary"></i></span>

              </p>
            </div>
            <div className="page-illustrations row no-gutters justify-content-center align-items-center flex-row">
              <div className="p-2 d-inline col">
                <img src="./assets/gmscreen_gmchoosecampaign_help.png" className="img-fluid" />
              </div>
              <div className="p-2 d-inline col">
                <img src="./assets/gmscreen_playerchoosecampaign_help.png" className="img-fluid" />
              </div>
            </div>
          </div>
        );
        break;
      case 4:
        CurrentPage = (
          <div className="page">
            <div className="page-text px-4 row no-gutters">
              <p>
                GameMasters can configure a Campaign by uploading images to be shared.
                After you have chosen the image to upload from your local computer,
                give it a short, descriptive name rather than having to use the filename.
                Then, choose a category for your image:
                Environment images are background images, usually of locations your party will be visiting.
                Secondary images are people, items,
                or anything else of visual interest to your group that you may want to display in &#40;or independent of&#41; an Environment.

              </p>
            </div>
            <div className="page-illustrations row no-gutters justify-content-center align-items-center flex-row">
              <div className="p-2 d-inline col">
                <img src="./assets/gmscreen_campaignconfig_help.png" className="img-fluid" />
              </div>
            </div>
          </div>
        );
        break;
      case 5:
        CurrentPage = (
          <div className="page">
            <div className="page-text px-4 row no-gutters">
              <p>
                Finally, you will arrive at your primary GM or Player screen.
                Environment images will display prominently in the background,
                with Secondary images displayed in an area over &#40;or without!&#41; the Environment background.
              </p>
            </div>
            <div className="page-illustrations row no-gutters justify-content-center align-items-center flex-row">
              <div className="p-2 d-inline col">
                <img src="./assets/gmscreen_player_help.png" className="img-fluid" />
              </div>
            </div>
            <div className="page-text px-4 row no-gutters">
              <div><hr/></div>
              <p>
                Gamemasters additionally see all the images available in this campaign.
                Simply click one to add display it to all the Players in your Session.
                You can also remove images from the display, or clear all the Secondary images with one click.
              </p>
            </div>
            <div className="page-illustrations row no-gutters justify-content-center align-items-center flex-row">
              <div className="p-2 d-inline col">
                <img src="./assets/gmscreen_gm_help.png" className="img-fluid" />
              </div>
            </div>
          </div>
        );
        break;
    }
    const nextButtonIcon = `fas ${this.state.page === this.state.lastPage ? 'fa-redo-alt' : 'fa-angle-double-right'}`;
    return (
      <div className="modal backdrop-blur p-5 d-flex justify-content-center align-items-center">
        <div id="help-modal" className="w-50 card">
          <div className="help-modal-header d-flex justify-content-end">
            <div className="close-button">
              <button className="btn btn-danger" onClick={this.props.toggleHelpModal}>
                <i className="fa fa-times" />
              </button>
            </div>
          </div>
          <div className="card-body help-modal-body px-4 pt-0">
            {CurrentPage}
          </div>
          <div className="card-footer bg-dark">
            <div className="row w-100 justify-content-around">
              <button className="btn btn-outline-light w-25" disabled={this.state.page <= 1} onClick={this.turnPage.bind(this, -1)}><i className="fas fa-angle-double-left"></i></button>
              <button className="btn btn-outline-light w-25" onClick={this.turnPage.bind(this, 1)}><i className={nextButtonIcon}></i></button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HelpModal;
