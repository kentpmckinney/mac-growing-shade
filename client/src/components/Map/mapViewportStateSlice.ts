import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Config from '../../config/application.json';

export interface ViewportState {
  latitude: number
  longitude: number
  zoom: number
  style: string
  selectedFeature: string
}

const initialState: ViewportState = {
  latitude: Config.startingMapProperties.center.latitude,
  longitude: Config.startingMapProperties.center.longitude,
  zoom: Config.startingMapProperties.zoom,
  style: Config.startingMapProperties.style,
  selectedFeature: ''
};

const viewport = createSlice({
  name: 'viewport',
  initialState,
  reducers: {
    setViewport(state: ViewportState, { payload }: PayloadAction<ViewportState>) {
      state.latitude = payload.latitude;
      state.longitude = payload.longitude;
      state.zoom = payload.zoom;
      state.style = payload.style;
      state.selectedFeature = payload.selectedFeature;
    },
  },
});

export const { setViewport } = viewport.actions;
export default viewport.reducer;