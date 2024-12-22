import React, {useState, useEffect, useRef} from "react";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";

import pl from '../../translations/polski.json'
import en from '../../translations/english.json'
import auth from "../../env";

const Change = (props) => {

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

  const Change = (event) => {
    event.preventDefault();
    const email = loginForm.current.email.value;
    const cur_password = loginForm.current.curpassword.value;
    const new_password = loginForm.current.newpassword.value;
    const new_conf_password = loginForm.current.newconfpassword.value;
    const Busername = auth.BASIC_AUTH_USERNAME
    const Bpassword = auth.BASIC_AUTH_PASSWORD
    const token = btoa(`${Busername}:${Bpassword}`); // Encode credentials
    axios
      .post("https://jbsite-api.onrender.com/api/users/password", { email, cur_password, new_password, new_conf_password},
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
          loginForm.current.curpassword.value = "";
          loginForm.current.newconfpassword.value = "";
          loginForm.current.newpassword.value = "";
        }
      });
  };

  

    return (
    <div className="users">
      {/* <h1>Login/Register page</h1>
      <p>in development</p>
      <br></br> */}
      <form className="contact_form" ref={loginForm} onSubmit={Change}>
        <div className="mb-3">
          <h3>{lang.translation.login.changePageTitle}</h3>
          <label htmlFor="email" className="form-label">{lang.translation.login.email}</label>
          <input type="email" className="form-control" id="email" name="email" placeholder="name@example.com" required></input>
        </div>        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">{lang.translation.login.oldPassword}</label>
          <input type="password" className="form-control" id="curpassword" name="curpassword" placeholder="*********" required></input>
        </div>  
        <div className="mb-3">
          <label htmlFor="newpassword" className="form-label">{lang.translation.login.newPassword}</label>
          <input type="password" className="form-control" id="newpassword" name="newpassword" placeholder="*********" required></input>
        </div> 
        <div className="mb-3">
          <label htmlFor="newconfpassword" className="form-label">{lang.translation.login.confNewPassword}</label>
          <input type="password" className="form-control" id="newconfpassword" name="newconfpassword" placeholder="*********" required></input>
        </div>     
        <div className="mb-3">
          <button title={lang.translation.login.change} className="diagrams_submit_button" type="submit">{lang.translation.login.change}</button>
        </div>        
      </form>
      <div className={responseClass}>
        <p>{responseMsg}</p>
      </div>
      
      
    </div>
    
  
  )
  };
  
  export default Change;