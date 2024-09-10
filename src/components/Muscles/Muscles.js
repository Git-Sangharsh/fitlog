import React, { useEffect, useState } from "react";
import "./Muscles.css";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Muscles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fetchData, setFetchData] = useState([]); // Data is now an array of categories

  useEffect(() => {
    axios
      .get("http://localhost:5000/categories")
      .then((res) => setFetchData(res.data)) // Fetch the data
      .catch((err) => console.error(err.message)); // Log any error
  }, []);

  // Handler to show exercises and notes when clicked
  const handleClick = (category, exercises) => {
    dispatch({ type: 'SET_SELECTED_EXERCISE', payload: exercises });
    dispatch({ type: 'SET_LIST_EXERCISE', payload: exercises });
    navigate("/list");
  };

  return (
    <div className="home-container">
      <div className="home-wrapper">
        {/* Render categories dynamically */}
        {fetchData.map((category) => (
          <div
            key={category._id}
            className="exercise-box"
            onClick={() => handleClick(category.name, category.exercises)}
          >
            <h1 className="exercise-name">{category.name.toUpperCase()}</h1> {/* Show category name as header */}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Muscles;
