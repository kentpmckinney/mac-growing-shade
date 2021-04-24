import { combineReducers } from '@reduxjs/toolkit'
import sliderReducer from '../components/Map/InputOverlay/Slider/SliderStateSlice'
import toggleReducer from '../components/Map/InputOverlay/Toggle/ToggleStateSlice'
import viewportReducer from '../components/Map/mapViewportStateSlice'
import loadingMessageReducer from '../components/Map/LoadingIndicator/LoadingIndicatorStateSlice'

const rootReducer = combineReducers({
  sliders: sliderReducer,
  toggles: toggleReducer,
  viewport: viewportReducer,
  loading: loadingMessageReducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
