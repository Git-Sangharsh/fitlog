import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../Store/Store"; // Adjust the path as needed
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import "./AddMuscle.css";

const AddMuscle = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const [exerciseExist, setExerciseExist] = useState(false);

  const addMuscleBox = useSelector((state) => state.addMuscleBox);
  const currentMuscle = useSelector((state) => state.currentMuscle);
  const selectedExercise = useSelector((state) => state.selectedExercise);
  const currentUserEmail = useSelector((state) => state.currentUserEmail);
  // const listExercise = useSelector((state) => state.listExercise)

  useEffect(() => {
    if (exerciseExist) {
      const timeOut = setTimeout(() => {
        setExerciseExist(false);
      }, 3000);
      return () => clearTimeout(timeOut);
    }
  }, [exerciseExist]);

  const handleAddMuscle = async () => {
    if (inputValue.trim()) {
      try {
        const res = await axios.post("https://fitlog-server.onrender.com/category", {
          name: inputValue,
          userEmail: currentUserEmail,
        });

        if (res.data.status === true) {
          dispatch({ type: "SET_ADD_MUSCLE_BOX" });
          dispatch({ type: "SET_POP_STATUS", payload: true });
        }
        // Clear the input field
        setInputValue("");
        // Fetch updated categories
        dispatch(fetchCategories(currentUserEmail));
      } catch (err) {
        console.error("Error while adding the muscle:", err);
      }
    }
  };

  const handleAddMuscleExercise = async () => {
    if (inputValue.trim()) {
      try {
        const res = await axios.post(
          `https://fitlog-server.onrender.com/${currentMuscle}/exercise`,
          {
            name: inputValue,
            userEmail: currentUserEmail,
          }
        );

        if (res.data.exerciseExist === true) {
          setExerciseExist(true);
        }

        // console.log(res.data)
        if (res.data.status === true) {
          // Dispatch an action to update the exercises list in the Redux store
          dispatch({
            type: "SET_SELECTED_EXERCISE",
            payload: [...selectedExercise, { name: inputValue, notes: [] }], // Append new exercise to current list
          });
          dispatch({ type: "SET_ADD_MUSCLE_BOX" });
          dispatch({ type: "SET_POP_STATUS", payload: true });

          // Clear the input field
          setInputValue("");
        }
      } catch (err) {
        console.error("Error while adding the muscle with Exercise:", err);
      }
    }
  };

  const handleMainBtn = () => {
    if (location.pathname === "/muscle") {
      handleAddMuscle();
    } else if (location.pathname === "/muscle/exercise") {
      handleAddMuscleExercise();
    }
  };

  const handleCloseAddMuscle = () => {
    dispatch({ type: "SET_ADD_MUSCLE_BOX" });
    setExerciseExist(false);
    setInputValue("");
    // console.log("cliclkajdflj");
  };

  // console.log(selectedExercise);
  // console.log(listExercise)
  // console.log("location is", location.pathname);x
  // console.log("current muscle is ", currentMuscle)

  return (
    <AnimatePresence>
      {addMuscleBox && (
        <motion.div
          className="add-muscle-container"
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, type: "linear" }}
          exit={{ opacity: 0, scale: 1.5 }}
        >
          <div className="add-muscle-wrapper">
            <h1 className="add-muscle-header">
              {location.pathname === "/muscle" && "ADD MUSCLE"}
              {location.pathname === "/muscle/exercise" && "ADD EXERCISE"}
            </h1>
            <div className="add-muscle-wrapper-innner">
              <input
                className="add-muscle-wrapper-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  location.pathname === "/muscle"
                    ? "ADD MUSCLE"
                    : location.pathname === "/muscle/exercise"
                    ? "ADD EXERCISE"
                    : ""
                }
              />
              <button
                className="add-muscle-wrapper-btn"
                onClick={handleMainBtn}
              >
                {location.pathname === "/muscle" && "ADD MUSCLE"}
                {location.pathname === "/muscle/exercise" && "ADD EXERCISE"}
              </button>
              <button
                className="add-muscle-wrapper-btn"
                onClick={handleCloseAddMuscle}
              >
                CLOSE
              </button>
              <h6 className="not-valid">
                {exerciseExist && "Exercise Already Exist"}
              </h6>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMuscle;
