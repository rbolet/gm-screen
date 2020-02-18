import React from 'react';
import TokensDisplay from './tokens';

function HeroView(props) {
  let HeroView;
  if (props.session.environmentImageFileName) {
    HeroView = (
      <div className="environment-image h-100 w-100 position-relative" style={{ backgroundImage: `url(./images/${props.session.environmentImageFileName})` }}>
        {props.isGM && <div className="close m-1"><i className="fa fa-times-circle" onClick={props.clearEnvironmentImage}></i></div>}
      </div>
    );
  } else {
    HeroView = (
      <div className="placeholder d-flex justify-content-center align-items-center w-100 h-100">
        <div className="fade-loop w-100" id="GM-alt-text">GM-Screen</div>
      </div>
    );
  }

  return (
    <div className="hero-view w-100 h-100 d-flex justify-content-center">
      {HeroView}
      <TokensDisplay
        tokens={props.session.tokens}
        removeToken={props.removeToken}
        tokenDetails={props.tokenDetails}
        clearAllTokens={props.clearAllTokens} />
    </div>
  );
}

export default HeroView;
