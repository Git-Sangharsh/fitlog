import React from "react";
import "./Exerciselist.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Exerciselist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedExercise = useSelector((state) => state.selectedExercise) || []; // Ensure it's always an array
//   const listExercise = useSelector((state) => state.listExercise) || []; // Ensure it's always an array

  const handleClick = (exercise) => {
    // console.log("Exercise ", exercise);
    dispatch({ type: 'SET_LIST_EXERCISE', payload: exercise });
    navigate("/data");
  };
 console.log(selectedExercise)
  return (
    <div className="home-container">
      {/* <h1 className="details-wrapper-exercise-data">{selectedExercise}</h1> */}

      <div className="home-wrapper">
        {selectedExercise.length > 0 ? (
          selectedExercise.map((exercise, index) => (
            <div
              className="exercise-box"
              key={index}
              onClick={() => handleClick(exercise)}
            >
              <h1 className="exercise-name">{exercise.name.toUpperCase()}</h1>
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
