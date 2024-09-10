import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AddMuscle.css";
import { useSelector } from "react-redux";

const AddMuscle = () => {

  const addMuscleBox = useSelector((state) => state.addMuscleBox)


  return (
    <AnimatePresence>
      {addMuscleBox && <motion.div
      initial={{scale: 1.5, opacity: 0}}
      animate={{scale: 1, opacity: 1}}
      transition={{duration: 0.5, type: "spring"}}
      exit={{scale: 1.5, opacity: 0}}
       className="add-muscle-container">
        <div className="add-muscle-wrapper">
          <h1 className="add-muscle-header">ADD MUSCLE</h1>
          <div className="add-muscle-wrapper-innner">
            <input className="add-muscle-wrapper-input" placeholder="Enter Muscle Name" type="text" />
            <button className="add-muscle-wrapper-btn">ADD</button>
          </div>
        </div>
      </motion.div>}
    </AnimatePresence>
  );
};

export default AddMuscle;
