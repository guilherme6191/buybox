import React from 'react';
import {Modal, Button} from 'react-bootstrap'

const MyModal = function({shown, close, confirm, text, title}) {
  return (
    <div className="modal-container" style={{height: 200}}>
      <Modal
        show={shown}
        onHide={close}
        container={this}
        aria-labelledby="contained-modal-title">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {text}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirm}>Confirmar</Button>
          <Button onClick={close}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyModal;

