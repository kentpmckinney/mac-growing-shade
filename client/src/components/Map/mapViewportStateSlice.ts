import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Config from '../../config/application.json';

export interface ViewportState {
  latitude: number
  longitude: number
  zoom: number
  style?: string
}

const initialState: ViewportState = {
  latitude: 45.5099,
  longitude: -122.4348,
  zoom: 11,
  style: Config.mapStyle.street
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
    },
  },
});

export const { setViewport } = viewport.actions;
export default viewport.reducer;