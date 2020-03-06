import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

export default function TextChatWindow() {

  return (
    <Accordion className="text-chat-window" defaultActiveKey="">
      <Card>
        <Accordion.Collapse eventKey="0">
          <Card.Body className="bg-secondary">
            <ul>
              <li>stuff</li>
              <li>things</li>
            </ul>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0" className="chat-footer bg-dark">
          Click me!
        </Accordion.Toggle>
      </Card>
    </Accordion>
  );
}
