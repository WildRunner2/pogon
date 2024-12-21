import React, {useState, useEffect, useRef} from "react";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";

import pl from '../../translations/polski.json'
import en from '../../translations/english.json'
import auth from "../../env";

const Register = (props) => {

  const loginForm = useRef();
  const language = props.language
  const [responseMsg, setResponseMsg] = useState("");
  const [responseClass, setResponseClass] = useState("login_res_hide");


  let lang
  if (language === 'pl') {
    lang = pl
  } else {
    lang = en
  }

  const Register = (event) => {
    event.preventDefault();
    const email = loginForm.current.email.value;
    const login = loginForm.current.name.value;
    const password = loginForm.current.password.value;
    const conf_password = loginForm.current.conf_password.value;    
    const Busername = auth.BASIC_AUTH_USERNAME
    const Bpassword = auth.BASIC_AUTH_PASSWORD
    const token = btoa(`${Busername}:${Bpassword}`); // Encode credentials
    axios
      .post("http://localhost:3010/api/users/", { email,login, password, conf_password},
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      )
      .then((response) => {
        const status = response?.data?.data?.status;
        console.log(response)
        if (status === "OK") {
          setResponseClass("login_res_show login_res_s");
          setResponseMsg("Success")
          }
        else{
          setResponseClass("login_res_show login_res_f");
          setResponseMsg(response.data.data)
        }
      })
      .catch((error) => {
        console.error(error);

        setResponseClass("login_res_show login_res_f");
        setResponseMsg(error.message || lang.translation.login.error);
      })
      .finally(() => {
        // Clear form inputs after submission
        if (loginForm.current) {
          loginForm.current.email.value = "";
          loginForm.current.name.value = "";
          loginForm.current.password.value = "";
          loginForm.current.conf_password.value = "";
        }
      });
  };

  


  
 
    return (
    <div className="users">
      {/* <h1>Login/Register page</h1>
      <p>in development</p>
      <br></br> */}
      <form className="contact_form" ref={loginForm} onSubmit={Register}>
        <div className="mb-3">
          <h3>{lang.translation.login.regPageTitle}</h3>
          <label htmlFor="email" className="form-label">{lang.translation.login.email}</label>
          <input type="email" className="form-control" id="email" name="email" placeholder="name@example.com" required></input>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">{lang.translation.login.name}</label>
          <input type="text" className="form-control" id="name" name="name" placeholder="Jhon" required></input>
        </div>  
        <div className="mb-3">
          <label htmlFor="password" className="form-label">{lang.translation.login.password}</label>
          <input type="password" className="form-control" id="password" name="password" placeholder="*********" required></input>
        </div>  
        <div className="mb-3">
          <label htmlFor="conf_password" className="form-label">{lang.translation.login.confirmPassword}</label>
          <input type="password" className="form-control" id="conf_password" name="conf_password" placeholder="*********" required></input>
        </div>      
        <div className="mb-3">
          <button title={lang.translation.contact.send} className="diagrams_submit_button" type="submit">{lang.translation.login.register}</button>
        </div>        
      </form>
      <div className={responseClass}>
        <p>{responseMsg}</p>
      </div>
      
      {/* <br></br>
            <div className="loader"></div> */}
    </div>
    
  
  )
  };
  
  export default Register;