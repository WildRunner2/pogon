import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import emailjs from '@emailjs/browser';

import pl from '../../translations/polski.json';
import en from '../../translations/english.json';
import auth from "../../env";

const Register = (props) => {
  const loginForm = useRef();
  const language = props.language;
  const [responseMsg, setResponseMsg] = useState("");
  const [responseClass, setResponseClass] = useState("login_res_hide");
  const [generatedToken, setGeneratedToken] = useState(null);
  const [userToken, setUserToken] = useState("");
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isTokenSent, setIsTokenSent] = useState(false); // To control token state
  const timerRef = useRef(null);

  const [inputType, setInputype] = useState("password")
  const [showPassIcon, setShowPassIcon] = useState(faEye)
  const [inputTypeConf, setInputypeConf] = useState("password")
  const [showPassIconConf, setShowPassIconConf] = useState(faEye)

  const dev = auth.DEV;
  const host = dev ? auth.DEV_URL: auth.PROD_URL;



  let lang;
  if (language === 'pl') {
    lang = pl;
  } else {
    lang = en;
  }

  // Generate a random token
  const generateToken = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  // Start countdown timer
  const startCountdown = () => {
    setRemainingTime(120); // 1 minute
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGeneratedToken(null); // Clear token on expiry
          setIsTokenVerified(false); // Reset verification status
          setIsTokenSent(false); // Allow generating a new token
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop countdown timer
  const stopCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const sendTokenEmail = () => {
    const email = loginForm.current.email.value;
    const name = loginForm.current.name.value;
    const password = loginForm.current.password.value;
    const conf_password = loginForm.current.conf_password.value;

    if(password!==conf_password){
      setResponseClass("login_res_show login_res_f");
      setResponseMsg(lang.translation.login.missingFields || "Passwords are not the same.");
      return;
    } else if (password.length<6){
      setResponseClass("login_res_show login_res_f");
      setResponseMsg(lang.translation.login.missingFields || "Password need to contain at least 6 characters.");
      return;
    }

    if (!email || !name) {
      setResponseClass("login_res_show login_res_f");
      setResponseMsg(lang.translation.login.missingFields || "Please fill out all fields before generating the token.");
      return;
    }

    const token = generateToken();
    setGeneratedToken(token);
    setIsTokenSent(true);
    startCountdown();

    const message = {
      "to_email":email,
      "to_name":name,
      "token":token,
      "from_name":"bddapp"
    };

    emailjs
      .send('service_r8ip6cl', 'template_gvl5o66', message, 'hukFXsRwDW8g83sOM')
      .then(() => {
        setResponseClass("login_res_show login_res_s");
        setResponseMsg(lang.translation.login.tokenSent || "Token sent to your email. Please verify.");
      })
      .catch((error) => {
        console.error("Error sending token email:", error);
        setResponseClass("login_res_show login_res_f");
        setResponseMsg(lang.translation.login.emailError || "Error sending token email. Please try again.");
      });
  };

  const handleTokenVerification = () => {
    if (userToken === generatedToken) {
      setIsTokenVerified(true);
      setResponseClass("login_res_show login_res_s");
      setResponseMsg(lang.translation.login.tokenVerified || "Token verified successfully!");
    } else {
      setResponseClass("login_res_show login_res_f");
      setResponseMsg(lang.translation.login.invalidToken || "Invalid token. Please try again.");
    }
  };

  const handleRegister = (event) => {
    event.preventDefault();

    const email = loginForm.current.email.value;
    const login = loginForm.current.name.value;
    const password = loginForm.current.password.value;
    const conf_password = loginForm.current.conf_password.value;

    if (!isTokenVerified) {
      setResponseClass("login_res_show login_res_f");
      setResponseMsg(lang.translation.login.verifyTokenFirst || "Please verify the token before registering.");
      return;
    }

    const Busername = auth.BASIC_AUTH_USERNAME;
    const Bpassword = auth.BASIC_AUTH_PASSWORD;
    const token = btoa(`${Busername}:${Bpassword}`); // Encode credentials    

    axios
      .post(
        host+"/api/users/",
        { email, login, password, conf_password },
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      )
      .then((response) => {
        const status = response?.data?.data?.status;
        if (status === "OK") {
          setResponseClass("login_res_show login_res_s");
          setResponseMsg(lang.translation.login.success || "Registration successful! Go to the login page to proceed.");
        } else {
          setResponseClass("login_res_show login_res_f");
          setResponseMsg(response.data.data || "Registration failed.");
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
        setGeneratedToken(null);
        setUserToken("");
        setIsTokenVerified(false);
        setIsTokenSent(false);
      });
  };

  const showPassword = (event) => {
    event.preventDefault()   
    setInputype(inputType==="password"?"text":"password")
    setShowPassIcon(inputType==="password"?faEyeSlash:faEye)
  }
  const showPasswordConf = (event) => {
    event.preventDefault()        
    setInputypeConf(inputTypeConf==="password"?"text":"password")
    setShowPassIconConf(inputTypeConf==="password"?faEyeSlash:faEye)
  }
  // Cleanup timer on component unmount
  useEffect(() => {
    return () => stopCountdown();
  }, []);

  return (
    <div className="users">
      <form className="contact_form" ref={loginForm} onSubmit={handleRegister}>
        <div className="mb-3">
          <h3>{lang.translation.login.regPageTitle}</h3>
          <label htmlFor="email" className="form-label">{lang.translation.login.email}</label>
          <input type="email" className="form-control" id="email" name="email" placeholder="name@example.com" required></input>
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">{lang.translation.login.name}</label>
          <input type="text" className="form-control" id="name" name="name" placeholder="John" required></input>
          
        </div>
        <div className="mb-3 pass">
          <label htmlFor="password" className="form-label">{lang.translation.login.password}</label>
          <input type={inputType} className="form-control" id="password" name="password" placeholder="*********" required></input>
          <button className="showPass" type="button" onClick={showPassword}><FontAwesomeIcon icon={showPassIcon} /></button>
        </div>
        <div className="mb-3 pass">
          <label htmlFor="conf_password" className="form-label">{lang.translation.login.confirmPassword}</label>
          <input type={inputTypeConf} className="form-control" id="conf_password" name="conf_password" placeholder="*********" required></input>
          <button className="showPass" type="button" onClick={showPasswordConf}><FontAwesomeIcon icon={showPassIconConf} /></button>
        </div>

        {!isTokenSent && (
          <div className="mb-3">
            <button
              type="button"
              className="diagrams_submit_button"
              onClick={sendTokenEmail}
            >
              {lang.translation.login.generateToken || "Generate Token"}
            </button>
          </div>
        )}

        {generatedToken && (
          <div className="mb-3">
            <label htmlFor="token" className="form-label">{lang.translation.login.enterToken || "Enter the token sent to your email:"}</label>
            <input
              type="text"
              className="form-control"
              id="token"
              name="token"
              value={userToken}
              onChange={(e) => setUserToken(e.target.value)}
              placeholder="Enter token"
              required
            />
            <button
              type="button"
              className="diagrams_submit_button mt-2"
              onClick={handleTokenVerification}
            >
              {lang.translation.login.verifyToken || "Verify Token"}
            </button>
            <p>
              {lang.translation.login.tokenExpires || "Token expires in:"} {remainingTime}s
            </p>
          </div>
        )}

        <div className="mb-3">
          <button title={lang.translation.contact.send} className="diagrams_submit_button" type="submit" disabled={!isTokenVerified}>
            {lang.translation.login.register}
          </button>
        </div>
      </form>
      <div className={responseClass}>
        <p>{responseMsg}</p>
      </div>
    </div>
  );
};

export default Register;
