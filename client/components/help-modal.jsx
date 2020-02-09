import React from 'react';

class HelpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };

    this.turnPage = this.turnPage.bind(this);

  }

  turnPage(change) {
    const lastPage = 2;
    let page = this.state.page + change;
    if (page < 1) page = lastPage;
    if (page > lastPage) page = 1;
    this.setState({ page });
  }

  render() {
    let CurrentPage;
    switch (this.state.page) {
      case 1:
        CurrentPage = (
          <div className="page px-4">
            <p>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GM-Screen is an application to supplement the storytelling and enhance the immersion of traditional paper-and-dice role playing games,
              allowing Game Masters to share images in real time with the rest of the player group.
              Since GM-Screen does not use any game mechanics, it is useable with any system, game,
              or any situation imaginable where visual aids can add to a group&apos;s shared experience.
              Using the app is simple …
            </p>
          </div>
        );
        break;
      case 2:
        CurrentPage = (
          <div className="page">
            <div className="page-text px-4 row no-gutters">
              <p>
                Simply log in with your existing username and password: <span><i className="fas fa-sign-in-alt text-success"></i></span><br/>
                or create a new one: <span><i className="fas fa-user-plus text-secondary"></i></span>
                <br /><br />Then, choose your Role: are you the Gamemaster<span ><i className="fas fa-hat-wizard text-danger"></i>&nbsp;</span>
                who will be choosing which visual information to share, or a Player <span ><i className="fas fa-dice text-warning"></i>&nbsp;</span>
                receiving the information?
              </p>
            </div>
            <div className="page-illustrations row no-gutters justify-content-center align-items-center flex-row">
              <div className="p-2 d-inline col">
                <img src="./assets/gmscreen_userlogin_help.png" alt="user login example" className="img-fluid"/>
              </div>
              <div className="p-2 d-inline col">
                <img src="./assets/gmscreen_chooserole_help.png" alt="user login example" className="img-fluid"/>
              </div>
            </div>
          </div>
        );
        break;
    }
    return (
      <div className="modal backdrop-blur p-5 d-flex justify-content-center align-items-center">
        <div className="modal-dialog-scrollable h-100 w-50">
          <div className="bg-light rounded-lg modal-content help-modal p-0" >
            <div className="modal-header border-bottom-0 help-modal-header">
              <div className="close">
                <i className="fa fa-times" onClick={this.props.toggleHelpModal} />
              </div>
            </div>
            <div className="modal-body help-modal-body px-4 pt-0">
              {CurrentPage}
            </div>
            <div className="modal-footer bg-dark">
              <div className="row w-100 justify-content-around">
                <button className="btn btn-outline-light w-25" onClick={this.turnPage.bind(this, -1)}><i className="fas fa-angle-double-left"></i></button>
                <button className="btn btn-outline-light w-25" onClick={this.turnPage.bind(this, 1)}><i className="fas fa-angle-double-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HelpModal;
