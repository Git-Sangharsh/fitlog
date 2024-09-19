import React from "react";
import "./Welcome.css";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const Welcome = () => {
  const dispatch = useDispatch();
  const authBox = useSelector((state) => state.authBox);
  const loginStatus = useSelector((state) => state.loginStatus);

  const handleWelcomeSign = () => {
    dispatch({ type: "SET_AUTH_BOX", payload: true });
  };

  // console.log("loginStatus", loginStatus);
  return (
    <AnimatePresence>
      {!authBox && !loginStatus && (
        <motion.div
          className="welcome-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, type: "linear" }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div className="welcome-wrapper">
            <h1 className="welcome-txt">Welcome To FitLogs</h1>
            <h4 className="welcome-tag">
              Your ultimate fitness companion to help you log, track, and
              monitor your workouts. Get started with FitTrack to take your
              fitness journey to the next level!
            </h4>
            <h4 className="welcome-tag">Feature Overview:</h4>
            <li className="welcome-li">
              Track Your Progress: Easily log sets, reps, and exercises for
              every workout session.
            </li>
            <li className="welcome-li">
              Personalized Workouts: Create custom workout plans tailored to
              your fitness goals.
            </li>
            <li className="welcome-li">
              Analyze Your Growth: Visualize your performance improvements and
              track your gains over time.
            </li>
            <li className="welcome-li">
              Sign Up to start your fitness journey and keep track of your
              progress! Already have an account?
            </li>
            <li className="welcome-li">
              Log In to access your personalized workouts and progress data.
            </li>
            <button className="btn-sign-up" onClick={handleWelcomeSign}>
              SIGN UP
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Welcome;
