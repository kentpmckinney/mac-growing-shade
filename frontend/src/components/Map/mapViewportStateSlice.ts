import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import Config from '../../config/application.json'

export type BlockFeature = {
  latitude: number | null
  longitude: number | null
  properties: Object
  selected: string | null
}

export type ParcelFeature = {
  latitude: number | null
  longitude: number | null
  isPopupVisible: boolean
  properties: Object
}

export type Features = {
  isTransitionInProgress: boolean
  block: BlockFeature
  parcel: ParcelFeature
}

export interface ViewportState {
  latitude: number
  longitude: number
  zoom: number
  style: string
  feature: Features
  activeLayer: string | null
}

const initialState: ViewportState = {
  latitude: Config.startingMapProperties.center.latitude,
  longitude: Config.startingMapProperties.center.longitude,
  zoom: Config.startingMapProperties.zoom,
  style: Config.startingMapProperties.style,
  activeLayer: 'block',
  feature: {
    isTransitionInProgress: false,
    block: {
      latitude: null,
      longitude: null,
      selected: null,
      properties: {},
    },
    parcel: {
      latitude: null,
      longitude: null,
      properties: {},
      isPopupVisible: false,
    },
  },
}

const viewport = createSlice({
  name: 'viewport',
  initialState,
  reducers: {
    setViewport(state: ViewportState, { payload }: PayloadAction<ViewportState>) {
      state.latitude = payload.latitude
      state.longitude = payload.longitude
      state.zoom = payload.zoom
      state.style = payload.style
      state.activeLayer = payload.activeLayer
      state.feature = {
        isTransitionInProgress: payload.feature.isTransitionInProgress,
        block: {
          latitude: payload.feature.block.latitude,
          longitude: payload.feature.block.longitude,
          selected: payload.feature.block.selected,
          properties: payload.feature.block.properties,
        },
        parcel: {
          latitude: payload.feature.parcel.latitude,
          longitude: payload.feature.parcel.longitude,
          properties: payload.feature.parcel.properties,
          isPopupVisible: payload.feature.parcel.isPopupVisible,
        },
      }
    },
  },
})

export const { setViewport } = viewport.actions
export default viewport.reducer
