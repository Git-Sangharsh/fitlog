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
import Auth from "./components/auth/Auth";
import Welcome from "./components/welcome/Welcome";
import DateComponent from "./components/date/Date";
// import Filter from "./components/filter/Filter";

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
                    <DateComponent />
                    {/* <Muscles /> */}
                    <AddMuscle />
                    <Auth />
                    <Welcome />
                  </div>
                }
              />
              <Route
                path="/muscle"
                element={
                  <div>
                    <Nav />
                    <Muscles />
                    <AddMuscle />
                    <Auth />
                  </div>
                }
              />
              <Route
                path="/muscle/exercise"
                element={
                  <div>
                    <Nav />
                    <Exerciselist />
                    <AddMuscle />
                  </div>
                }
              />
              <Route
                path="/muscle/exercise/set"
                element={
                  <div>
                    <Exercisedata />
                  </div>
                }
              />
              <Route
                path="/date"
                element={
                  <div>
                    <Nav />
                    <DateComponent />
                  </div>
                }
              />
              {/* <Route
                path="/filter"
                element={
                  <div>
                    <Nav />
                    <Filter />
                  </div>
                }
              /> */}
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
