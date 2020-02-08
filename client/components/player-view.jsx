import React from 'react';
import HeroView from './hero-view';

function PlayerView(props) {
  return (
    <div className="player-view row no-gutters h-100 w-100">
      <div className="hero-view-container col-12">
        <HeroView session={props.config.gameSession.session}/>
      </div>
    </div>
  );
}

export default PlayerView;
