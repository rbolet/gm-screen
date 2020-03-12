import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

function LastMessage() {
  return (
    <Form inline className="row no-gutters col-11">
      <FormControl type="text" className="last-message col-11" readOnly />
    </Form>
  );
}

function EnterText() {
  const [formText, setFormText] = useState('');

  return (
    <Form inline className="row no-gutters justify-content-around">
      <FormControl type="text" className="last-message col-10" value={formText} onChange={event => setFormText(event.target.value)}/>
      <div className="col d-flex justify-content-center mx-1">
        <Button className="w-100" type="submit" variant="success" onClick={() => { useGetMessages(formText); setFormText(''); }}>
          <i className="far fa-paper-plane"></i>
        </Button>
      </div>
    </Form>
  );
}

function useGetMessages(newMessage) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!newMessage) return;
    const copy = messages.slice();
    setMessages(copy.push(newMessage));
  }, []);

  return messages;
}

function ChatMessages() {
  const messages = useGetMessages();

  const MessageElements = messages.length ? messages.map((message, index) => {
    return <li key={index}>{message}</li>;
  }) : null;

  return (
    <>
      <ul>{MessageElements}</ul>
      <EnterText/>
    </>
  );
}

function TextChatWindow(props) {

  return (
    <Accordion className="text-chat-window" defaultActiveKey="">
      <Card>
        <Accordion.Toggle as={Card.Header}
          eventKey="0" className="chat-footer bg-dark p-1">
          <div className="row w-100">
            <LastMessage />
            <button className="btn btn-danger">
              <i className="fa fa-times"></i>
            </button>
          </div>
        </Accordion.Toggle>
      </Card>
      <Card>
        <Accordion.Collapse eventKey="0">
          <div>
            <Card.Body className="bg-secondary px-0 pb-1">
              <ChatMessages/>
            </Card.Body>
          </div>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );

}
export default TextChatWindow;
