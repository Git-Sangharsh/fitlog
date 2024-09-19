import React, { useEffect } from "react";
import "./Muscles.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../Store/Store"; // Adjust the path as needed
import trashSvg from "../assets/trash.svg";
import axios from "axios";

const Muscles = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get categories from Redux store
  const fetchData = useSelector((state) => state.listExercise);
  const currentUserEmail = useSelector((state) => state.currentUserEmail);

  useEffect(() => {
    dispatch(fetchCategories(currentUserEmail));
  }, [dispatch, currentUserEmail]);

  // Handler to show exercises and notes when clicked
  const handleClick = (category, exercises) => {
    // Assuming exercises is an object where keys are categories and values are arrays of exercises
    dispatch({ type: "SET_SELECTED_EXERCISE", payload: exercises[category]  });
    dispatch({ type: "SET_CURRENT_MUSCLE", payload: category });
    navigate("/muscle/exercise");
    // console.log("category is ", category, "exercises is ", exercises[category]);
  };


  // Handler to delete a specific name
  const handleTrash = async (name) => {
    try {
      // Sending DELETE request with category name in the path and userEmail as a query parameter
      const response = await axios.delete(`https://fitlog-server.onrender.com/category/${name}`, {
        params: { userEmail: currentUserEmail }, // Pass userEmail as query parameter
      });

      console.log(response.data.message);

      // Refetch the categories to update the UI
      dispatch(fetchCategories(currentUserEmail));
    } catch (error) {
      console.error("Error deleting the category:", error);
    }
  };

  const loginStatus = useSelector((state) => state.loginStatus)


  return (
    <div className="home-container">
      <div className="home-wrapper">
        {fetchData.length > 0 && loginStatus ? (
          fetchData.flatMap((category) =>
            Array.isArray(category.name)
              ? category.name.map((name) => (
                  <div key={`${category._id}-${name}`} className="exercise-box">
                    <h1
                      className="exercise-name"
                      onClick={() => handleClick(name, category.exercises)}
                    >
                      {name.toUpperCase()}
                    </h1>
                    <img
                      className="trash-logo"
                      onClick={() => handleTrash(name)} // Pass the specific name
                      src={trashSvg}
                      alt="Delete"
                    />
                  </div>
                ))
              : [
                  <div key={category._id} className="exercise-box">
                    <h1
                      className="exercise-name"
                      onClick={() => handleClick(category.name, category.exercises)}
                    >
                      {category.name.toUpperCase()}
                    </h1>
                    <img
                      className="trash-logo"
                      onClick={() => handleTrash(category.name)} // Pass the specific name
                      src={trashSvg}
                      alt="Delete"
                    />
                  </div>,
                ]
          )
        ) : (
          <div>No categories found</div>
        )}
      </div>
    </div>
  );
};

export default Muscles;
