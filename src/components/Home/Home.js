import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import "./Home.css";

const Home = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get("http://localhost:5000/chest/exercises")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err.message));
  }, []);

  console.log("data is", data)

  const handleClick = (exercise) => {
    // Dispatch selected exercise to Redux
    dispatch({ type: 'SET_SELECTED_EXERCISE', payload: exercise });

    // Navigate to the details page
    navigate("/details");
  };

  return (
    <div className='home-container'>
      <div className="home-wrapper">
        {
          data.map((exercise, index) => (
            <div
              className='exercise-box'
              key={index}
              onClick={() => handleClick(exercise)} // Handle click to change route
            >
              <h1>{exercise.name}</h1>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Home;
