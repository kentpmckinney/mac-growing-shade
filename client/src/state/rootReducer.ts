import { combineReducers } from '@reduxjs/toolkit';
import sliderReducer from '../components/Map/SliderOverlay/Slider/SliderStateSlice';

const rootReducer = combineReducers({
  sliders: sliderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;