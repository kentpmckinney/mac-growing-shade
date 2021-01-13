import { combineReducers } from '@reduxjs/toolkit';
import sliderReducer from '../components/Map/SliderOverlay/Slider/SliderStateSlice';
import viewportReducer from '../components/Map/mapViewportStateSlice';

const rootReducer = combineReducers({
  sliders: sliderReducer,
  viewport: viewportReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;