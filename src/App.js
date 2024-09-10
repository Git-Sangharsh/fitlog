import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { defaultPersistor } from "./Store/Store"; // Import default store and persistor
import Muscles from "./components/Muscles/Muscles";
// import Details from "./components/Details/Details";
import Exerciselist from "./components/ExerciseList/Exerciselist";
import Exercisedata from "./components/ExerciseData/Exercisedata";
import Nav from "./components/nav/Nav";
import AddMuscle from "./components/addMuscle/AddMuscle";

//! Muscles -> Exerciselist -> Exercisedata

const App = () => {
  // const selectedExercise = useSelector((state) => state.selectedExercise);

  // console.log("selectedExercise ", selectedExercise);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={defaultPersistor}>
        <Router>
          <div className="app">
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <Nav />
                    <Muscles />
                    <AddMuscle />
                  </div>
                }
              />
              <Route path="/list" element={<Exerciselist />} />
              <Route path="/data" element={<Exercisedata />} />
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
