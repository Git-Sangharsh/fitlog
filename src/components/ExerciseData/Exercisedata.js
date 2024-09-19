import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Exercisedata.css";
import addSvg from "../assets/add-icon.svg";
import minusSvg from "../assets/minus-muscle.svg";
import axios from "axios";
import { fetchCategories } from "../../Store/Store"; // Adjust the path as needed
import { AnimatePresence } from "framer-motion";

const Exercisedata = () => {
  const dispatch = useDispatch();

  // Add a state to track the selected note's index
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [kgValue, setkgValue] = useState(0);
  const [repsValue, setRepsValue] = useState(0);

  const handlekgValue = (e) => {
    setkgValue(e.target.value);
  };

  const handleDecrement = () => {
    setkgValue(kgValue > 0 ? kgValue - 2.5 : 0);
  };

  const handleIncrement = () => {
    setkgValue(kgValue + 2.5);
  };

  const handleRpValue = (e) => {
    setRepsValue(e.target.value);
  };

  const handleRpInc = () => {
    setRepsValue(repsValue + 1);
  };

  const handleRpDec = () => {
    setRepsValue(repsValue > 0 ? repsValue - 1 : 0);
  };

  const currentMuscle = useSelector((state) => state.currentMuscle);
  const currentExercise = useSelector((state) => state.currentExercise);
  const currentUserEmail = useSelector((state) => state.currentUserEmail);
  // const popStatus = useSelector((state) => state.popStatus);

  // console.log("currentExercise", currentExercise)
  // console.log(popStatus)

  useEffect(() => {
    const updateExercise = async () => {
      try {
          // Fetch categories
          dispatch(fetchCategories(currentUserEmail));

          // Get updated exercise data
          const updatedExerciseRes = await axios.get(
            `http://localhost:5000/category/${currentMuscle}/exercise/${currentExercise.name}?userEmail=${currentUserEmail}`
          );

          // console.log("updateExercise Res = ", updatedExerciseRes.data);

          // Dispatch updated exercise data
          dispatch({
            type: "UPDATE_CURRENT_EXERCISE",
            payload: updatedExerciseRes.data,
          });
      } catch (error) {
        console.error("Error fetching exercise data:", error);
      }
    };

    // Trigger the update when required values change
    updateExercise();

  }, [ currentUserEmail, currentMuscle,currentExercise.name, dispatch]);

  useEffect(() => {
    if (currentExercise) {
      dispatch(fetchCategories());
    }
  }, [dispatch, currentExercise]);

  useEffect(() => {
    dispatch(fetchCategories(currentUserEmail));
  }, [dispatch, currentUserEmail]);


  // useEffect(() => {
  //   if (popStatus) {
  //     const timeOut = setTimeout(() => {
  //       dispatch({type: "SET_POP_STATUS", payload: false});
  //     }, 3000);

  //     return () => clearTimeout(timeOut);
  //   }
  // }, [popStatus,dispatch]);

  if (!currentExercise) {
    return <p>No exercise selected.</p>;
  }

  const getDateWithoutTime = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const groupedNotes = (currentExercise.notes || []).reduce((acc, note) => {
    const dateWithoutTime = getDateWithoutTime(note.date);
    if (!acc[dateWithoutTime]) {
      acc[dateWithoutTime] = [];
    }
    acc[dateWithoutTime].push(note);
    return acc;
  }, {});

  // const handleAddOrUpdateSet = async () => {
  //   try {
  //     const encodedExerciseName = encodeURIComponent(currentExercise.name);
  //     if (selectedNoteIndex !== null) {
  //       // Update an existing set by using the _id (noteId)
  //       const res = await axios.put(
  //         `http://localhost:5000/category/${currentMuscle}/exercise/${encodedExerciseName}/note/${selectedNoteIndex}`, // Use _id (selectedNoteIndex)
  //         {
  //           weight: kgValue,
  //           reps: repsValue,
  //           userEmail: currentUserEmail,
  //         }
  //       );
  //       if (res.data.status === true) {
  //         console.log("Successfully updated the set.");
  //         dispatch(fetchCategories(currentUserEmail));
  //         setSelectedNoteIndex(null);
  //       }
  //     } else {
  //       // Add a new set
  //       // /category/:categoryName/exercise/:exerciseName/note
  //       const res = await axios.post(
  //         `http://localhost:5000/category/${currentMuscle}/exercise/${encodedExerciseName}/note`,
  //         {
  //           weight: kgValue,
  //           reps: repsValue,
  //           userEmail: currentUserEmail,
  //         }
  //       );
  //       if (res.data.status === true) {
  //         console.log("Successfully added the set.");
  //         dispatch(fetchCategories(currentUserEmail));
  //       }
  //     }

  //     // Fetch the updated exercise
  //     const updatedExerciseRes = await axios.get(
  //       `http://localhost:5000/category/${currentMuscle}/exercise/${encodedExerciseName}?userEmail=${currentUserEmail}`
  //     );

  //     dispatch({
  //       type: "UPDATE_CURRENT_EXERCISE",
  //       payload: updatedExerciseRes.data,
  //     });
  //   } catch (err) {
  //     console.log("Error while saving Set!!!", err);
  //   }
  // };

  // When a note is clicked, populate the input fields and save the note's index
  const getIndex = (weight, reps, id) => {
    // console.log("Note Index", weight, reps, id);
    setkgValue(weight);
    setRepsValue(reps);
    setSelectedNoteIndex(id); // Store the index for later update
    if (selectedNoteIndex === id) {
      setSelectedNoteIndex(null); //
    }
  };

  // console.log("currentMuscle: " + currentMuscle)
  // console.log("currentExercise.name " + currentExercise.name)
  // console.log("userEmail: " + currentUserEmail)

  const handleAddSet = async () => {
    const encodedExerciseName = encodeURIComponent(currentExercise.name);
    const res = await axios.post(
      `http://localhost:5000/category/${currentMuscle}/exercise/${encodedExerciseName}/note`,
      {
        weight: kgValue,
        reps: repsValue,
        userEmail: currentUserEmail,
      }
    );




    dispatch({type: "SET_POP_STATUS", payload: true});

    if (res.data.status === true) {
      // console.log("Successfully added the set.");
      dispatch(fetchCategories(currentUserEmail));
      const updatedExerciseRes = await axios.get(
        `http://localhost:5000/category/${currentMuscle}/exercise/${encodedExerciseName}?userEmail=${currentUserEmail}`
      );

      dispatch({
        type: "UPDATE_CURRENT_EXERCISE",
        payload: updatedExerciseRes.data,
      });
    }
  };

  const handleUpdateSet = async () => {
    const encodedExerciseName = encodeURIComponent(currentExercise.name);
    if (selectedNoteIndex !== null) {
      // Update an existing set by using the _id (noteId)
      const res = await axios.put(
        `http://localhost:5000/category/${currentMuscle}/exercise/${encodedExerciseName}/note/${selectedNoteIndex}`, // Use _id (selectedNoteIndex)
        {
          weight: kgValue,
          reps: repsValue,
          userEmail: currentUserEmail,
        }
      );
      if (res.data.status === true) {
        console.log("Successfully updated the set.");
        dispatch(fetchCategories(currentUserEmail));
        setSelectedNoteIndex(null);
      }
      const updatedExerciseRes = await axios.get(
        `http://localhost:5000/category/${currentMuscle}/exercise/${encodedExerciseName}?userEmail=${currentUserEmail}`
      );

      dispatch({
        type: "UPDATE_CURRENT_EXERCISE",
        payload: updatedExerciseRes.data,
      });
    }
  };

  const handleDeleteSet = async () => {
    const encodedExerciseName = encodeURIComponent(currentExercise.name);

    if (selectedNoteIndex !== null) {
      try {
        // Send the DELETE request with proper data format
        const res = await axios.delete(
          `http://localhost:5000/category/${currentMuscle}/exercise/${encodedExerciseName}/note/${selectedNoteIndex}`,
          {
            data: {
              userEmail: currentUserEmail,
            },
          }
        );

        if (res.data.status === true) {
          console.log("Successfully deleted the set.");
          dispatch(fetchCategories(currentUserEmail));
          setSelectedNoteIndex(null);
        }

        const updatedExerciseRes = await axios.get(
          `http://localhost:5000/category/${currentMuscle}/exercise/${encodedExerciseName}?userEmail=${currentUserEmail}`
        );

        dispatch({
          type: "UPDATE_CURRENT_EXERCISE",
          payload: updatedExerciseRes.data,
        });
      } catch (error) {
        console.error("Error deleting the set:", error);
      }
    }
  };


  return (
    <div className="details-container">
      <h1 className="details-wrapper-exercise-data">
        {currentExercise.name.toUpperCase()}
      </h1>
      <div className="details-wrapper">
        <div className="add-set-box">
          <h4 className="details-wrapper-box-date">
            {selectedNoteIndex !== null ? "EDIT SET" : "ADD SET"}
          </h4>
          <div className="add-set-box-inner">
            <img
              className="icon-logo"
              onClick={handleDecrement}
              src={minusSvg}
              alt=""
            />
            <input
              className="add-set-input"
              onChange={handlekgValue}
              value={kgValue}
              type="number"
            />
            <img
              className="icon-logo"
              onClick={handleIncrement}
              src={addSvg}
              alt=""
            />
          </div>
          <div className="add-set-box-inner">
            <img
              className="icon-logo"
              onClick={handleRpDec}
              src={minusSvg}
              alt=""
            />
            <input
              className="add-set-input"
              onChange={handleRpValue}
              value={repsValue}
              type="number"
            />
            <img
              className="icon-logo"
              onClick={handleRpInc}
              src={addSvg}
              alt=""
            />
          </div>
          {selectedNoteIndex !== null ? (
            <div className="grid-div">
              <button className="grid-btn green" onClick={handleUpdateSet}>
                UPDATE
              </button>
              <button className="grid-btn red" onClick={handleDeleteSet}>
                DELETE
              </button>
            </div>
          ) : (
            <button className="save-btn" onClick={handleAddSet}>
              SAVE
            </button>
          )}
          {/* <button className="save-btn" onClick={handleAddOrUpdateSet}>
            {selectedNoteIndex !== null ? "UPDATE" : "SAVE"}
          </button> */}
        </div>
        {Object.entries(groupedNotes)
          .sort((a, b) => new Date(b[0]) - new Date(a[0])) // Sort by date in descending order
          .map(([date, notes], dateIndex) => (
            <div className="details-wrapper-box" key={dateIndex}>
              <h4 className="details-wrapper-box-date">{formatDate(date)}</h4>
              {notes.map((note, noteIndex) => (
                <div
                  className={`details-wrapper-box-inner ${
                    selectedNoteIndex === note._id ? "selected-note" : ""
                  }`} // Add class conditionally
                  onClick={() => getIndex(note.weight, note.reps, note._id)}
                  key={noteIndex}
                >
                  <h4 className="details-wrapper-box-weight">
                    Weight: {note.weight} Kg
                  </h4>
                  <h4 className="details-wrapper-box-reps">
                    Reps: {note.reps}
                  </h4>
                </div>
              ))}
            </div>
          ))}
      </div>
      <AnimatePresence >

      {/* {popStatus && (
            <motion.div
              className="pop"
              initial={{ y: "300%", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ y: "300%", opacity: 0 }}
              transition={{ duration: 1, type: "spring" }}
            >
              <h4>Set Added!</h4>
            </motion.div>
          )} */}
      </AnimatePresence>

    </div>
  );
};

export default Exercisedata;
