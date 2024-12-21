import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';


import pl from '../translations/polski.json'
import en from '../translations/english.json'


const Contact = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow(false);
  const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [message, setMessage] = useState('');

  const language = props.language
  let lang
  if (language === 'pl') {
    lang = pl
  } else {
    lang = en
  }
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();


    emailjs.sendForm('service_iryz1z9', 'template_nv4wj4l', form.current, 'hukFXsRwDW8g83sOM')
      .then((result) => {
        setShow(true);
        setName(form.current.name.value);

        // console.log(result.text);
      }, (error) => {
        setShow1(true);
        // console.log(error.text);
      });


  };

  return (
    <div className="container-fluid contact">
      <form className="contact_form" ref={form} onSubmit={sendEmail}>
        <div className="mb-3">
          <h3>Fell free to contact me <br></br>in any case</h3>
          <label htmlFor="name" className="form-label">{lang.translation.contact.name}</label>
          <input type="text" className="form-control" id="name" name="name" placeholder="John Doe" required></input>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">{lang.translation.contact.email}</label>
          <input type="email" className="form-control" id="email" name="email" placeholder="name@example.com" required></input>
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">{lang.translation.contact.textarea}</label>
          <textarea className="form-control" name="message" id="message" rows="3" required></textarea>
        </div>
        <div className="mb-3">
          <button title={lang.translation.contact.send} className="diagrams_submit_button" type="submit">{lang.translation.contact.send}</button>
        </div>
      </form>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{lang.translation.contact.thanks}{name}{lang.translation.contact.emailsent}</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body><br></br></Modal.Body> */}
        {/* <Modal.Footer>
          <Button variant="success" onClick={handleClose} onKeyUp={(e) => { if (e.key === "Enter" && !e.defaultPrevented) e.currentTarget.click(); }}>
          {lang.translation.fucntionStorage.close}
          </Button>

        </Modal.Footer> */}
      </Modal>
      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>{lang.translation.contact.emailsentF}</Modal.Title>
        </Modal.Header>
        {/* <Modal.Body><br></br></Modal.Body> */}
        {/* <Modal.Footer>
          <Button variant="success" onClick={handleClose} onKeyUp={(e) => { if (e.key === "Enter" && !e.defaultPrevented) e.currentTarget.click(); }}>
          {lang.translation.fucntionStorage.close}
          </Button>

        </Modal.Footer> */}
      </Modal>
    </div>

  );
};

export default Contact;

