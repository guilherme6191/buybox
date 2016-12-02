import React from 'react';
import { connect } from 'react-redux'
import { submitContactForm } from '../actions/contact';
import Messages from './Messages';

const Contact = () => {
  return (
    <div className="container">
      <div className="panel">
        <div className="panel-heading">
          Caso queria entrar em contato, favor enviar email para  
          <a href="mailto:buyboxmail@gmail.com">buyboxmail@gmail.com</a>.
        </div>
      </div>
    </div>
  );
}

export default Contact;
