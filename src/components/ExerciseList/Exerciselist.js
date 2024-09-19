import React, { useEffect } from "react";
import "./Exerciselist.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../Store/Store";
import trashSvg from "../assets/trash.svg";
import axios from "axios";

const Exerciselist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get selectedExercise from Redux store
  const selectedExercise = useSelector((state) => state.selectedExercise) || [];
  // console.log("selectedExercise", selectedExercise);
  const currentMuscle = useSelector((state) => state.currentMuscle);
  // console.log("currentMuscle", currentMuscle);
  // Current user's email from Redux store
  const currentUserEmail = useSelector((state) => state.currentUserEmail);

  useEffect(() => {
    if (currentUserEmail) {
      dispatch(fetchCategories(currentUserEmail));
    }
  }, [dispatch, currentUserEmail]);

  // Handle exercise click
  const handleClick = (exercise) => {
    dispatch({ type: "SET_LIST_EXERCISE", payload: exercise });
    dispatch({ type: "SET_CURRENT_EXERCISE", payload: exercise });
    navigate("/muscle/exercise/set");
    // console.log("selected Exercise is ", exercise);
  };

  const handleTrashExercise = async (exerciseName) => {
    try {
      const response = await axios.delete(`http://localhost:5000/category/${currentMuscle}/exercise/${exerciseName}`, {
        data: { userEmail: currentUserEmail }, // Ensure userEmail is passed correctly
      });

      if (response.data.status === true) {
        // Refresh categories after deletion
        dispatch(fetchCategories(currentUserEmail));

        // Fetch the updated exercise list for the current muscle category
        const getUpdatedExercise = await axios.get(`http://localhost:5000/category/${currentMuscle}/exercises`, {
          params: { userEmail: currentUserEmail } // Pass userEmail in query params
        });
        dispatch({type: "SET_SELECTED_EXERCISE", payload: getUpdatedExercise.data})
        // console.log("Updated Exercise List:", getUpdatedExercise.data);
      }

      // console.log("Exercise deleted:", response.data);

    } catch (err) {
      console.error("Error while deleting exercise:", err.message);
    }
    // console.log("Deleted exercise name:", exerciseName);
  };



  return (
    <div className="home-container">
      <div className="home-wrapper">
        {selectedExercise.length > 0 ? (
          selectedExercise.map((exercise) => (
            <div
              className="exercise-box"
              key={exercise._id || exercise.name} // Use a unique identifier; fallback to name if _id is not available
            >
              <div></div>
              <h1
                className="exercise-name"
                onClick={() => handleClick(exercise)}
              >
                {exercise.name.toUpperCase()}
              </h1>
              <img
                className="nav-logo"
                onClick={() => handleTrashExercise(exercise.name)}
                src={trashSvg}
                alt=""
              />
            </div>
          ))
        ) : (
          <p>No exercises available</p>
        )}
      </div>
    </div>
  );
};

export default Exerciselist;
