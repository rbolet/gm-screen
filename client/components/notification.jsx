import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';

function Notification() {
  const [show, setShow] = useState(false);

  return (
    <div className="row">
      <div className="col">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Header>
            <strong className="mr-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>Update Message</Toast.Body>
        </Toast>
      </div>
    </div>
  );
}

export default Notification;
