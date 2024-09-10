import React from "react";
import { useSelector } from "react-redux";
import "./Details.css";

const Details = () => {
  const selectedExercise = useSelector((state) => state.selectedExercise);

  if (!selectedExercise) {
    return <p>No exercise selected.</p>;
  }

  // Helper function to format the date in the "YYYY-MM-DD" format (for grouping)
  const getDateWithoutTime = (dateString) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  // Helper function to display the formatted date as "WEDNESDAY, SEPTEMBER 4"
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Group notes by date (ignoring time)
  const groupedNotes = selectedExercise.notes.reduce((acc, note) => {
    const dateWithoutTime = getDateWithoutTime(note.date);
    if (!acc[dateWithoutTime]) {
      acc[dateWithoutTime] = [];
    }
    acc[dateWithoutTime].push(note);
    return acc;
  }, {});

  return (
    <div className="details-container">
        <h1>{selectedExercise.name}</h1>

      <div className="details-wrapper">
        {/* Loop through the grouped notes and render each date group in its own box */}
        {Object.entries(groupedNotes).map(([date, notes], dateIndex) => (
          <div className="details-wrapper-box" key={dateIndex}>
            {/* Display the formatted date */}
            <h4 className="details-wrapper-box-date">{formatDate(date)}</h4>
            {notes.map((note, noteIndex) => (
              <div className="details-wrapper-box-inner" key={noteIndex}>
                <h4 className="details-wrapper-box-weight">Weight: {note.weight} Kg</h4>
                <h4 className="details-wrapper-box-reps">Reps: {note.reps}</h4>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Details;
