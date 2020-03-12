import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

// function getPlayers() {

// }

export default function PlayerList(props) {
  // const [Players, setPlayers] = useState(null);
  // const gameSession = props.config.gameSession;
  // const room = gameSession.sessionId ? `${gameSession.campaignName} (${gameSession.campaignId})` : null;
  // useEffect(() => {
  //   if (room) {
  //     setPlayers(getPlayers());
  //   }
  // }, []);

  return (
    <Accordion defaultActiveKey="" className="player-list">
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0" className="bg-dark">
          {/* {`Players in: ${room}`} */}
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          {/* <div className="bg-secondary px-1">{Players}</div> */}
          <div>
            <button onClick={props.getPlayerList}>Players</button>
          </div>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
