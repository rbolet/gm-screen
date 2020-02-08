import React from 'react';

function TokensDisplay(props) {

  return (
    <div className={'tokens-container backdrop-blur'}>
      <Tokens tokens={props.tokens} removeToken={props.removeToken}/>
    </div>
  );
}

function Tokens(props) {
  let CloseButton = null;
  const TokenElements = props.tokens.map(token => {
    if (props.removeToken) {
      CloseButton = (
        <div className="close m-1 d-flex">
          <i className="fa fa-times" onClick={props.removeToken.bind(this, token)}></i>
        </div>
      );
    }
    return (
      <div
        key={token.tokenId}
        style={{ backgroundImage: `url(./images/${token.imageFileName})` }}
        className="token mx-2">
        {CloseButton}
      </div>
    );
  });
  return TokenElements;
}

export default TokensDisplay;
