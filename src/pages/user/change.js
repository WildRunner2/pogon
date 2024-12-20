import React, {useState, useEffect, useRef} from "react";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";

import pl from '../../translations/polski.json'
import en from '../../translations/english.json'

const Change = (props) => {

  const loginForm = useRef();
  const language = props.language
  let lang
  if (language === 'pl') {
    lang = pl
  } else {
    lang = en
  }

  const Login = (event) => {
    event.preventDefault(event)
    console.log("kk");
    axios.post('http://localhost:3010/api/users/login',{
      email: 'j.f.blazyk@gmail.com',
      password: 'toor'

      }
    )
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });

  }

  

    return (
    <div className="users">
      {/* <h1>Login/Register page</h1>
      <p>in development</p>
      <br></br> */}
      <form className="contact_form" ref={loginForm} onSubmit={Login}>
        <div className="mb-3">
          <h3>{lang.translation.login.changePageTitle}</h3>
          <label htmlFor="email" className="form-label">{lang.translation.login.email}</label>
          <input type="email" className="form-control" id="email" name="email" placeholder="name@example.com" required></input>
        </div>        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">{lang.translation.login.oldPassword}</label>
          <input type="password" className="form-control" id="cur_password" name="cur_password" placeholder="*********" required></input>
        </div>  
        <div className="mb-3">
          <label htmlFor="new_password" className="form-label">{lang.translation.login.newPassword}</label>
          <input type="password" className="form-control" id="new_password" name="new_password" placeholder="*********" required></input>
        </div> 
        <div className="mb-3">
          <label htmlFor="new_conf_password" className="form-label">{lang.translation.login.confNewPassword}</label>
          <input type="password" className="form-control" id="new_conf_password" name="new_conf_password" placeholder="*********" required></input>
        </div>     
        <div className="mb-3">
          <button title={lang.translation.contact.send} className="diagrams_submit_button" type="submit">{lang.translation.login.change}</button>
        </div>        
      </form>
      
      
      {/* <br></br>
            <div className="loader"></div> */}
    </div>
    
  
  )
  };
  
  export default Change;