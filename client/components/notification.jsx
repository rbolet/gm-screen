import React, { useState, useEffect } from 'react';
import Toast from 'react-bootstrap/Toast';

function Notification(props) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(props.message);
  useEffect(() => {
    setMessage(props.message);
    setShow(true);
  }, [props.message]);

  return (
    <div className="row notification-toast">
      <div className="col">
        <Toast className={'bg-dark text-light'}onClose={() => setShow(false)} show={show} delay={3000} autohide>
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
