import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Config from '../../config/application.json';

export type SelectedFeature = {
  type: string
  fips: string
  showPopup: boolean
  latitude: number
  longitude: number
  properties: Object
}

export interface ViewportState {
  latitude: number
  longitude: number
  zoom: number
  style: string
  selectedFeature: SelectedFeature
  transition: boolean
}

const initialState: ViewportState = {
  latitude: Config.startingMapProperties.center.latitude,
  longitude: Config.startingMapProperties.center.longitude,
  zoom: Config.startingMapProperties.zoom,
  style: Config.startingMapProperties.style,
  selectedFeature: {
    type: 'block',
    fips: '',
    showPopup: false,
    latitude: 0,
    longitude: 0,
    properties: {}
  },
  transition: false
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
      state.selectedFeature = {
        type: payload.selectedFeature.type,
        fips: payload.selectedFeature.fips,
        showPopup: payload.selectedFeature.showPopup,
        latitude: payload.selectedFeature.latitude,
        longitude: payload.selectedFeature.longitude,
        properties: payload.selectedFeature.properties
      };
      state.transition = payload.transition;
    },
  },
});

export const { setViewport } = viewport.actions;
export default viewport.reducer;