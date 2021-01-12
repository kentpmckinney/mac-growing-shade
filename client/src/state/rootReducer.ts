import { combineReducers } from '@reduxjs/toolkit';
import sliderReducer from '../components/Map/SliderOverlay/Slider/SliderStateSlice';
import imageryReducer from '../components/Map/ImageryOverlay/ImageryToggle/ImageryToggleStateSlice';

const rootReducer = combineReducers({
  sliders: sliderReducer,
  imagery: imageryReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;