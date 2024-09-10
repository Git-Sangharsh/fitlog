import React from "react";
import "./Nav.css";
import navLogo from "../assets/nav-logo.png";
import AddMuscleSvg from "../assets/add-muscle.svg";
import { useDispatch, useSelector } from "react-redux";

const Nav = () => {

  const dispatch = useDispatch();
  const addMuscleBox = useSelector((state) => state.addMuscleBox);

  // console.log(addMuscle)

  const handleAddMuscle = () => {
    dispatch({type: "SET_ADD_MUSCLE_BOX"})
  };

  return (
    <div className="nav-container">
      <div className="nav-wrapper">
        <img className="nav-logo" src={navLogo} alt="" />
        <img className="nav-logo" onClick={handleAddMuscle} src={AddMuscleSvg} alt="" />
      </div>
    </div>
  );
};

export default Nav;
