import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import "./Filter.css"

const Filter = () => {
    const [dateFormat, setDateFormat] = useState('');
    const currentUserEmail = useSelector((state) => state.currentUserEmail);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [fetchData, setFetchData] = useState([]);

    useEffect(() => {
        setDateFormat(getFormattedDate(currentDate));
    }, [currentDate]);

    const getFormattedDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isSameDate = (noteDate) => {
        const note = new Date(noteDate);
        return (
            note.getFullYear() === currentDate.getFullYear() &&
            note.getMonth() === currentDate.getMonth() &&
            note.getDate() === currentDate.getDate()
        );
    };

    console.log(dateFormat)

    useEffect(() => {
        const getExerciseOnDate = async () => {
            try {
                if (currentUserEmail && dateFormat) {
                    const response = await axios.get('http://localhost:5000/exercises', {
                        params: {
                            userEmail: currentUserEmail,
                            date: "2024-09-17",
                        },
                    });
                    console.log('Fetched Data:', response.data); // Check if data is fetched
                    setFetchData(response.data);
                }
            } catch (err) {
                console.log('Error:', err.message);
            }
        };

        getExerciseOnDate();
    }, [dateFormat, currentUserEmail]);

    // Filter notes for the selected date
    const filterNotesByDate = (notes) => {
        return notes.filter((note) => isSameDate(note.date));
    };

    return (
        <div className='date-container'>
            <div className="date-wrapper">

            {Object.keys(fetchData).length > 0 ? (
                Object.keys(fetchData).flatMap((categoryName) =>
                    fetchData[categoryName].map((exercise) => {
                        const filteredNotes = filterNotesByDate(exercise.notes);
                        return filteredNotes.length > 0 ? (
                            <div key={exercise._id} className='details-wrapper-box'>
                                <h1 className='details-wrapper-box-date'>{exercise.name.toUpperCase()}</h1>
                                {filteredNotes.map((note) => (
                                    <div key={note._id} className='details-wrapper-box-inner gridd'>
                                        <h4>Weight: {note.weight}</h4>
                                        <h4>Reps: {note.reps}</h4>
                                        <h4>Date: {new Date(note.date).toLocaleString()}</h4>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p key={exercise._id}>No notes found for the selected date</p>
                        );
                    })
                )
            ) : (
                <p>No exercises found for the selected date.</p>
            )}
            </div>
        </div>
    );
};

export default Filter;
