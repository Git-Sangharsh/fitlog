import { createStore, applyMiddleware } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk"; // Corrected import
import axios from "axios";

// Initial state
const initialState = {
  currentUserEmail: "",
  selectedExercise: {}, // Initialize as an empty object
  listExercise: [],
  currentMuscle: "",
  currentExercise: "",
  addMuscleBox: false,
  authBox: false,
  dropDownBox: false,
  loginStatus: false,
  popStatus: false,
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SELECTED_EXERCISE":
      return { ...state, selectedExercise: action.payload };
    case "SET_LIST_EXERCISE":
      return { ...state, listExercise: action.payload };
    case "SET_ADD_MUSCLE_BOX":
      return { ...state, addMuscleBox: !state.addMuscleBox };
    case "SET_CURRENT_MUSCLE":
      return { ...state, currentMuscle: action.payload };
    case "SET_CURRENT_EXERCISE":
      return { ...state, currentExercise: action.payload };
    case "UPDATE_CURRENT_EXERCISE":
      return {
        ...state,
        currentExercise: action.payload, // Update with the fetched exercise
      };
    case "SET_AUTH_BOX":
      return { ...state, authBox: action.payload };
    case "SET_CURRENT_EMAIL":
      return { ...state, currentUserEmail: action.payload };
    case "SET_DROPDOWN_BOX":
      return { ...state, dropDownBox: action.payload };
    case "SET_LOGIN_STATUS":
      return { ...state, loginStatus: action.payload };
    case "SET_POP_STATUS":
      return { ...state, popStatus: action.payload };
    default:
      return state;
  }
};

// Action to fetch categories
export const fetchCategories = (userEmail) => async (dispatch) => {
  try {
    const res = await axios.get("https://fitlog-server.onrender.com/categories", {
      params: { userEmail },
    });
    // console.log("action fetch store ", res.data);
    dispatch({
      type: "SET_LIST_EXERCISE",
      payload: res.data,
    });
  } catch (err) {
    console.error("Error fetching categories", err);
  }
};

// Redux Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

// Create store with thunk middleware for async actions
const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

// Export store and persistor
export default store;
export const defaultPersistor = persistor;
