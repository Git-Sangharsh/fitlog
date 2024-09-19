import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./Date.css";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../../Store/Store";

const DateComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUserEmail = useSelector((state) => state.currentUserEmail);
  const loginStatus = useSelector((state) => state.loginStatus);
  const selectedExercise = useSelector((state) => state.selectedExercise);
  const currentExercise = useSelector((state) => state.currentExercise);
  // console.log("current Exercise is ", currentExercise)
  // console.log("selected exercise ", selectedExercise[0].notes)
  // console.log(selectedExercise[0]?.name)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateFormat, setDateFormat] = useState("");
  const [exercises, setExercises] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isYesterday = (date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate()
    );
  };

  useEffect(() => {
    setDateFormat(getFormattedDate(currentDate));
    dispatch(fetchCategories(currentUserEmail));
  }, [currentDate, dispatch, currentUserEmail]);

  const goToNextDate = () => {
    if (!isToday(currentDate)) {
      setCurrentDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setDate(prevDate.getDate() + 1);
        return newDate;
      });
    }
  };

  const goToPreviousDate = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  useEffect(() => {
    const getExerciseOnDate = async () => {
      setLoading(true);
      setError(false);

      try {
        if (currentUserEmail && dateFormat) {
          const response = await axios.get(`http://localhost:5000/exercises`, {
            params: {
              userEmail: currentUserEmail,
              date: dateFormat,
            },
          });
          setExercises(response.data);
        }
      } catch (err) {
        console.log(err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getExerciseOnDate();
  }, [dateFormat, currentUserEmail]);

  const handleSet = (exercise, category) => {
    // const matchExercise = selectedExercise.find((selExercise) => selExercise.name === exercise.name)
    dispatch({ type: "SET_LIST_EXERCISE", payload: exercise });
    dispatch({ type: "SET_CURRENT_EXERCISE", payload: exercise });
    navigate("/muscle/exercise/set");
    dispatch({ type: "SET_CURRENT_MUSCLE", payload: category });
    // console.log("matchExercise is ",matchExercise)
    // console.log(matchExercise.notes)
    // console.log(exercise);
    console.log("category is ", category);

  };

  // Helper function to filter notes by currentDate
  const filterNotesByDate = (notes) => {
    return notes.filter((note) => {
      const noteDate = new Date(note.date);
      return (
        noteDate.getFullYear() === currentDate.getFullYear() &&
        noteDate.getMonth() === currentDate.getMonth() &&
        noteDate.getDate() === currentDate.getDate()
      );
    });
  };
  // console.log("exercise is ", exercises);

  // console.log("res data is", exercises.back[1].notes)

  // console.log("get notes ", getNotes)
  return (
    <>
      {loginStatus && (
        <div className="date-container">
          <div className="date-wrapper">
            <div className="date-control">
              <button className="date-control-btn" onClick={goToPreviousDate}>
                Previous Date
              </button>
              <h1 className="today">
                {isToday(currentDate)
                  ? "Today"
                  : isYesterday(currentDate)
                  ? "Yesterday"
                  : dateFormat}
              </h1>
              <button
                className="date-control-btn"
                onClick={goToNextDate}
                disabled={isToday(currentDate)}
              >
                Next Date
              </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && !loading && (
              <h1 className="not-found">No workout data available.</h1>
            )}
            {!loading && !error && (
              <>
                {Object.keys(exercises).length > 0 ? (
                  Object.keys(exercises).flatMap((category) =>
                    exercises[category].map((exercise) => {
                      const filteredNotes = filterNotesByDate(exercise.notes);

                      return (
                        <div
                          className="details-wrapper-box"
                          onClick={() => handleSet(exercise, category)}
                          key={exercise._id}
                        >
                          <h1 className="details-wrapper-box-date">
                            {exercise.name.toUpperCase()}
                          </h1>
                          {filteredNotes.length > 0 ? (
                            <div className=" ">
                              {filteredNotes.map((note, index) => (
                                <div
                                  key={index}
                                  className="details-wrapper-box-inner"
                                >
                                  <h4 className="details-wrapper-box-weight">
                                    Weight: {note.weight}
                                  </h4>
                                  <h4 className="details-wrapper-box-reps">
                                    Reps: {note.reps}
                                  </h4>
                                  {/* <p>Date: {formatNotesDate(note.date)}</p> */}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>No notes for this exercise on this date.</p>
                          )}
                        </div>
                      );
                    })
                  )
                ) : (
                  <p>No exercises found for this date.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DateComponent;
