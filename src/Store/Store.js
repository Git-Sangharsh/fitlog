import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Initial state and reducer
const initialState = {
  selectedExercise: [],  // Make sure this is an array
  listExercise: [],
  addMuscleBox : false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SELECTED_EXERCISE':
      return { ...state, selectedExercise: action.payload };
    case "SET_LIST_EXERCISE":
      return { ...state, listExercise: action.payload };
    case "SET_ADD_MUSCLE_BOX":
      return {...state, addMuscleBox: !state.addMuscleBox}
    default:
      return state;
  }
};

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

// Create store
const store = createStore(persistedReducer);
const persistor = persistStore(store);

// Export store and persistor as default exports
export default store;
export const defaultPersistor = persistor;
