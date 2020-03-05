import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';

function Notification(props) {
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState('test message');

  if (props.message) {
    setShow(true);
    setMessage(props.message);
  }

  return (
    <div className="row notification-toast">
      <div className="col">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Header>
            <strong className="mr-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
}

export default Notification;
