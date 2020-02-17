import React from 'react';
import Form from 'react-bootstrap/Form';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

function TokenDetailsModal(props) {

  return (
    <div className="modal backdrop-blur p-5 d-flex justify-content-center align-items-center">
      <div id="token-details-modal" className="w-50 card">
        <div className="token-details-header d-flex justify-content-end bg-dark">
          <div className="close-button">
            <button className="btn btn-danger">
              <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
        <div className="card-body help-modal-body p-2">
          <div className="w-100 h-100 container">
            <div className="row">
              <div className="thumbnail h-100 col-6">
                <img className="img-thumbnail mh-100" src="./images/0c00a350-dfbb-4d8f-98af-e0815bbdaefb..png" />
              </div>
              <div className="col-6 border rounded p-3 bg-dark text-white">
                <Form>
                  <Form.Group controlId="tokenName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" />
                  </Form.Group>
                  <Form.Group controlId="tokenDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows="6" />
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer bg-dark d-flex justify-content-around">
          {/* <ButtonGroup aria-label="Players">
            <Button active variant="outline-secondary">All</Button>
            <Button variant="outline-secondary">Player 1</Button>
            <Button variant="outline-secondary">Player 2</Button>
            <Button variant="outline-secondary">Player 3</Button>
            <Button variant="outline-secondary">Player 4</Button>
          </ButtonGroup> */}
          <Button variant="success">Send</Button>
        </div>
      </div>
    </div>
  );
}

export default TokenDetailsModal;
