import React, { useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

function LastMessage() {
  return (
    <Form inline className="row no-gutters">
      <FormControl type="text" className="last-message col-11" readOnly />
    </Form>
  );
}

function EnterText() {
  return (
    <Form inline className="row no-gutters">
      <FormControl type="text" className="last-message col-11" />
      <div className="col d-flex justify-content-center">
        <Button type="submit" variant="success">
          <i className="far fa-paper-plane"></i>
        </Button>
      </div>
    </Form>
  );
}

function TextChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  let Footer = null;
  if (!isOpen) {
    Footer = <LastMessage/>;
  } else {
    Footer = <EnterText/>;
  }

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
        <Accordion.Toggle onClick={() => { setIsOpen(!isOpen); }}as={Card.Header}
          eventKey="0" className="chat-footer bg-dark p-1">
          {Footer}
        </Accordion.Toggle>
      </Card>
    </Accordion>
  );

}
export default TextChatWindow;
