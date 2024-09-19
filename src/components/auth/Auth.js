import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { fetchCategories } from "../../Store/Store";

const Auth = () => {
  const dispatch = useDispatch();

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [toggleAuth, setToggleAuth] = useState(false); //false means current is signup

  // handling errors
  const [emailValid, setEmailValid] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [userNotExist, setUserNotExist] = useState(false);
  const [wrongCredential, setWrongCredential] = useState(false);

  const handleUserEmail = (e) => {
    const value = e.target.value;
    if (value.endsWith("@gmail.com")) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
    setUserEmail(value);
  };

  // console.log("email is ", emailValid);

  const handleUserPassword = (e) => {
    setUserPassword(e.target.value);
  };

  const handleToggleAuth = () => {
    setToggleAuth(!toggleAuth);
    setUserEmail("");
    setUserPassword("");
    setEmailValid(false);
    setUserExist(false);
    setWrongCredential(false);
  };

  const handleAuthRoute = () => {
    if (toggleAuth) {
      handlSignIn();
    } else {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    if (userPassword === "") {
      // console.log("pls enter password");
    } else {
      try {
        const res = await axios.post("https://fitlog-server.onrender.com/register", {
          userEmail: userEmail,
          userPass: userPassword,
        });
        // console.log(res.data);
        if(res.data.userExist === true){
          // console.log("User already exists");
          setUserExist(true);
        }
        if (res.data.status === true) {
          dispatch({ type: "SET_AUTH_BOX", payload: false });
          dispatch({ type: "SET_CURRENT_EMAIL", payload: userEmail });
          dispatch({ type: "SET_LOGIN_STATUS", payload: true });
          setUserEmail("");
          setUserPassword("");
          setUserExist(false)
        }
      } catch (err) {
        console.error("Error during signup:", err.message);
      }
    }
  };

  const authBox = useSelector((state) => state.authBox);
  // const currentUserEmail = useSelector((state) => state.currentUserEmail);
  // console.log(currentUserEmail);

  const handlSignIn = async () => {
    try {
      const res = await axios.post("https://fitlog-server.onrender.com/signin", {
        userEmail: userEmail,
        userPass: userPassword,
      });
      // console.log(res.data);
      if(res.data.wrongCredential === false){
        // console.log("wrong credential")
        setWrongCredential(true);
      }

      if(res.data.userExist === false){
        // console.log("user not found!!!")
        setUserNotExist(true)
      }
      if (res.data.status === true) {
        // alert("Signed up successfully!");
        dispatch({ type: "SET_AUTH_BOX", payload: false });
        dispatch({ type: "SET_CURRENT_EMAIL", payload: userEmail });
        dispatch({ type: "SET_LOGIN_STATUS", payload: true });
        setUserEmail("");
        setUserPassword("");
      }
    } catch (err) {
      console.error("Error during Signin:", err);
    }
  };

  const handleCloseAuth = () => {
    dispatch({ type: "SET_AUTH_BOX", payload: false });
    setUserEmail("");
    setUserPassword("");
    setEmailValid(false);
    setUserExist(false);
    setToggleAuth(false);
    setWrongCredential(false);
  };

  // const handleGoogleSignUP = async (credentialResponse) => {
  //   try {
  //     const decoded = jwtDecode(credentialResponse?.credential);
  //     const { email } = decoded;

  //     const response = await axios.post("http://localhost:5000/google-signup", {
  //       email,
  //     });
  //     // console.log(response.data);
  //     if (response.data.status === true) {
  //       dispatch({ type: "SET_AUTH_BOX", payload: false });
  //       dispatch({ type: "SET_CURRENT_EMAIL", payload: email });
  //       dispatch({ type: "SET_LOGIN_STATUS", payload: true });
  //     }
  //   } catch (err) {
  //     console.log("err while sign in with Google : ", err.message);
  //   }
  // };

  const handleGoogleSignIN = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse?.credential);
      const { email } = decoded;

      const response = await axios.post("https://fitlog-server.onrender.com/google-signin", {
        email,
      });
      console.log(response.data);
      if (response.data.status === true) {
        dispatch({ type: "SET_AUTH_BOX", payload: false });
        dispatch({ type: "SET_CURRENT_EMAIL", payload: email });
        dispatch({ type: "SET_LOGIN_STATUS", payload: true });
        dispatch(fetchCategories(email));
      }
    } catch (err) {
      console.log("err while sign in with Google : ", err.message);
    }
  };

  return (
    <AnimatePresence>
      {authBox && (
        <motion.div
          className="auth-container"
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, type: "linear" }}
          exit={{ opacity: 0, scale: 1.5 }}
        >
          <div className="auth-wrapper">
            <h1 className="auth-header">
              {toggleAuth ? "SIGN IN " : "SIGN UP"}
            </h1>
            <div className="auth-wrapper-innner">
              <input
                className="auth-wrapper-input"
                type="text"
                placeholder="john@gmail.com"
                value={userEmail}
                onChange={handleUserEmail}
              />
              <input
                className="auth-wrapper-input"
                type="password"
                placeholder="****"
                value={userPassword}
                onChange={handleUserPassword}
              />
              <button className="auth-wrapper-btn" onClick={handleAuthRoute}>
                {toggleAuth ? "SIGN IN " : "SIGN UP"}
              </button>

              <button className="auth-wrapper-btn" onClick={handleCloseAuth}>
                CLOSE
              </button>

                <GoogleLogin
                  onSuccess={handleGoogleSignIN}
                  onError={() => {
                    console.log("Google Sign-In Failed");
                  }}
                />

              <h6 className="toggle-auth" onClick={handleToggleAuth}>
                already user try,
                <span className="toggle-span">
                  {toggleAuth ? "SIGN UP" : "SIGN IN"}
                </span>
              </h6>

              <h6 className="not-valid">
                {!emailValid && userEmail.length > 0 && "Email is not valid"}
                {userExist && "Email Already in use!"}
                {wrongCredential && "Wrong Email or Password"}
                {userNotExist && "User Not Found!"}
              </h6>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Auth;
