import React, {useRef} from "react";

import axios from "axios";

import pl from '../../translations/polski.json'
import en from '../../translations/english.json'

import auth from "../../env"; 

const Reset = (props) => {

  const loginForm = useRef();
  const language = props.language
  let lang
  if (language === 'pl') {
    lang = pl
  } else {
    lang = en
  }

  const dev = auth.DEV;
  const host = dev ? auth.DEV_URL: auth.PROD_URL;

  const Login = (event) => {
    event.preventDefault(event)
    console.log("kk");
    axios.post(host+"/api/users/login",{
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
          <h3>{lang.translation.login.resPageTitle}</h3>
          <label htmlFor="email" className="form-label">{lang.translation.login.resetEmail}</label>
          <input type="email" className="form-control" id="email" name="email" placeholder="name@example.com" required></input>
        </div>              
        <div className="mb-3">
          <button title={lang.translation.contact.send} className="diagrams_submit_button" type="submit">{lang.translation.login.reset}</button>
        </div>        
      </form>
      
      
      {/* <br></br>
            <div className="loader"></div> */}
    </div>
    
  
  )
  };
  
  export default Reset;