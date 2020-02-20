import React from 'react';

function TokensDisplay(props) {
  let CloseButton = null;
  if (props.clearAllTokens && props.tokens.length > 0) {
    CloseButton = <div className="close m-1 d-inline">
      <i className="fa fa-times-circle" onClick={props.clearAllTokens}></i>
    </div>;
  }
  return (
    <div className={`tokens-container backdrop-blur${props.tokens.length > 0 ? '' : ' d-none'}`}>
      <Tokens tokens={props.tokens}
        removeToken={props.removeToken}
        tokenDetails={props.tokenDetails}/>
      {CloseButton}
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
        className="token mx-2 position-relative">
        {CloseButton}
        <div className="token-name-footer px-1 py-0 m-0" onClick={() => { props.tokenDetails(token); }}>
          <p>{token.tokenName}</p>
        </div>
      </div>
    );
  });
  return TokenElements;
}

export default TokensDisplay;
