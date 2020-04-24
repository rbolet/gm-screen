import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

export default function PlayerList(props) {
  const [playerList, setPlayerList] = React.useState([]);
  console.log(playerList);

  let Players = null;
  React.useEffect(() => {
    if (props.usersInRoom) { setPlayerList(props.usersInRoom); }
  }, [props.usersInRoom]);

  if (playerList.length) {
    Players = playerList.map(user => {
      return (
        <li key={user.userId}>{user.userName}</li>
      );
    });
  }

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
            <ul>{Players}</ul>
          </div>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
