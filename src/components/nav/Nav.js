import React, { useEffect } from "react";
import "./Nav.css";
import navLogo from "../assets/nav-logo.png";
import AddMuscleSvg from "../assets/add-muscle.svg";
// import userSvg from "../assets/user.svg";
import dropIconSvg from "../assets/drop-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // const muscleBox = useSelector((state) => state.addMuscleBox)
  // console.log(muscleBox)

  const dropDownBox = useSelector((state) => state.dropDownBox);
  const loginStatus = useSelector((state) => state.loginStatus);

  const handleAddMuscle = () => {
    dispatch({ type: "SET_ADD_MUSCLE_BOX" });
    dispatch({ type: "SET_DROPDOWN_BOX", payload: false });
  };

  const handleAuthBox = () => {
    dispatch({ type: "SET_AUTH_BOX", payload: false });
    dispatch({ type: "SET_DROPDOWN_BOX", payload: false });
  };

  const handleLogOut = () => {
    dispatch({ type: "SET_CURRENT_EMAIL", payload: "" });
    dispatch({ type: "SET_DROPDOWN_BOX", payload: false });
    dispatch({ type: "SET_LOGIN_STATUS", payload: false });
    dispatch({ type: "SET_LIST_EXERCISE", payload: [] });
  };
  // const currentUserEmail = useSelector((state) => state.currentUserEmail)
  // console.log(currentUserEmail)
  const handleToggleDrop = () => {
    dispatch({ type: "SET_DROPDOWN_BOX", payload: !dropDownBox });
  };

  const handleAuthOut = () => {
    if (loginStatus) {
      handleLogOut();
      navigate("/");
    } else {
      handleAuthBox();
    }
  };

  const handleCloseDrop = () => {
    dispatch({ type: "SET_DROPDOWN_BOX", payload: false });
  };

  useEffect(() => {
    if (dropDownBox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [dropDownBox]);

  const handleMuscleRoute = () => {
    navigate("/muscle");
  };

  // const popStatus = useSelector((state) => state.popStatus);
  // console.log(popStatus)

  // useEffect(() => {
  //   if (popStatus) {
  //     const timeOut = setTimeout(() => {
  //       dispatch({type: "SET_POP_STATUS", payload: false});
  //     }, 3000);

  //     return () => clearTimeout(timeOut);
  //   }
  // }, [popStatus,dispatch]);


  return (
    <div className="nav-container">
      <div className="nav-wrapper">
        <img className="nav-logo" src={navLogo} alt="" />
        {/* <img className="nav-logo" onClick={handleAddMuscle} src={AddMuscleSvg} alt="" />
        <img className="nav-logo" onClick={handleAuthBox} src={userSvg} alt="" />
        <button onClick={handleLogOut}>Log Out</button> */}
        {loginStatus && (
          <div className="right-nav">
            {location.pathname === "/" && (
              <img
                className="add-logo"
                onClick={handleMuscleRoute}
                src={AddMuscleSvg}
                alt=""
              />
            )}

            <img
              className="nav-logo"
              onClick={handleToggleDrop}
              src={dropIconSvg}
              alt=""
            />
          </div>
        )}
      </div>
      {loginStatus && (
        <AnimatePresence>
          {dropDownBox && (
            <motion.div
              className="drop-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0, type: "spring" }}
              exit={{ opacity: 0 }}
            >
              <div className="drop-style">
                <li className="drop-li" onClick={handleAddMuscle}>
                  {location.pathname === "/muscle" && "ADD MUSCLE"}
                  {location.pathname === "/muscle/exercise" && "ADD EXERCISE"}
                </li>
                {/* <li className="drop-li" onClick={handleAuthBox}> AUTH BOX</li> */}
                <li className="drop-li" onClick={handleAuthOut}>
                  {loginStatus ? "LOG OUT" : "SIGN IN"}
                </li>
                <li className="drop-li" onClick={handleCloseDrop}>
                  CLOSE
                </li>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      )}
    </div>
  );
};

export default Nav;
