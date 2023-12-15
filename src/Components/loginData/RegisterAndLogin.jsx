import React, { useState } from "react";
import { database } from "./FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './RegisterAndLogin.css';

// ... (imports remain unchanged)

function RegisterAndLogin() {
  const [login, setLogin] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);

  const history = useNavigate();

  const handleSubmit = (e, type) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (type === "signup") {
      createUserWithEmailAndPassword(database, email, password)
        .then((data) => {
          console.log(data, "authData");
          // Update state and navigate to sign-in page
          setLogin(true);
          setShowBackButton(true);
          history("/"); // Navigate to sign-in page
          resetForm(e);
        })
        .catch((err) => {
          alert(err.code);
          setLogin(true);
        });
    } else {
      signInWithEmailAndPassword(database, email, password)
        .then((data) => {
          console.log(data, "authData");
          history("/home"); // Navigate to home page
          resetForm(e);
        })
        .catch((err) => {
          alert(err.code);
        });
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    history("/reset");
  };

  const resetForm = (e) => {
    e.target.reset();
  };

  const handlePasswordReset = () => {
    // Navigate to the password reset page
    history("/reset");
  };

  return (
    <div className="App-bg">
      {/* Background Design */}
      <div class="bg-circles">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
        <div class="circle-3"></div>
        <div class="circle-4"></div>
      </div>
      <div className="App">
        <h1 className="Main-heading">Garv To-Do</h1>
        <h1 className="Second-heading">{login ? "SignIn(Let's Explore)" : "SignUp"}</h1>
        <form onSubmit={(e) => handleSubmit(e, login ? "signin" : "signup")}>
          <input name="email" placeholder="Enter Email" className="email" />
          <br />
          <input name="password" type="text" placeholder="Password" className="password" />
          <br />
          <button className="Login-btn">{login ? "SignIn" : "SignUp"}</button>
          <br />
          <div className="row">
            <div
              className={login === false ? "activeColor" : "pointer"}
              onClick={(e) => {
                setLogin(false);
                setShowBackButton(true);
                resetForm(e);
              }}
            >
              <p className="pcolor-1">No Account? <span className="span-1">Create One !</span> </p>
            </div>
            <div
              className={login === true ? "activeColor" : "pointer"}
              onClick={(e) => {
                setLogin(true);
                setShowBackButton(true);
                resetForm(e);
              }}
            >
              <p className="span-2">Have Account? Let's SignIn !</p>
            </div>
          </div>
          <p onClick={handleReset} className="forgot">Forgot Password?</p>
          <br />
        </form>
      </div>
    </div>
  );
}

export default RegisterAndLogin;
