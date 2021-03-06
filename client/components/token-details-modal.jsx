import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function TokenDetailsModal(props) {

  let thisToken = {};
  if (!props.token.tokenId) {
    thisToken = {
      tokenId: 'new',
      imageFileName: props.token.fileName,
      tokenName: props.token.alias,
      tokenDetails: ''
    };
  } else {
    thisToken = props.token;
  }
  const [tokenName, setTokenName] = useState(thisToken.tokenName);
  const [tokenDetails, setTokenDetails] = useState(thisToken.tokenDetails);

  function rebuildToken(thisToken) {
    return {
      tokenId: thisToken.tokenId,
      imageFileName: thisToken.imageFileName,
      tokenName,
      tokenDetails
    };
  }
  return (
    <div className="modal backdrop-blur p-5 d-flex justify-content-center align-items-center">
      <div id="token-details-modal" className="w-50 card">
        <div className="token-details-header d-flex justify-content-end bg-dark">
          <div className="close-button">
            <button className="btn btn-danger" onClick={props.clearModal}>
              <i className="fa fa-times"></i>
            </button>
          </div>
        </div>
        <div className="card-body help-modal-body p-2">
          <div className="w-100 h-100 container">
            <div className="row">
              <div className="thumbnail h-100 col-6">
                <img className="img-thumbnail mh-100" src={`./images/${thisToken.imageFileName}`} />
              </div>
              <div className="col-6 border rounded p-3 bg-dark text-white">
                <Form>
                  <Form.Group controlId="tokenName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text"
                      readOnly={!props.isGM}
                      value={tokenName}
                      onChange={event => setTokenName(event.target.value)}/>
                  </Form.Group>
                  <Form.Group controlId="tokenDetails">
                    <Form.Label>Details</Form.Label>
                    <Form.Control as="textarea" rows="6"
                      readOnly={!props.isGM}
                      value={tokenDetails}
                      onChange={event => setTokenDetails(event.target.value)}/>
                  </Form.Group>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer bg-dark d-flex justify-content-around">
          {props.addToken && <Button
            variant="success"
            onClick={() => { props.addToken(rebuildToken(thisToken)); props.clearModal(); }}
          >
            <i className="far fa-edit"/>
            <p className="button-text m-0">Update Details</p>
          </Button>}
        </div>
      </div>
    </div>
  );
}

export default TokenDetailsModal;
