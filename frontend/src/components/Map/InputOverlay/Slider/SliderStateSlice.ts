import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SliderValue = {
  min: number
  max: number
}

export interface SliderItem {
  name: string
  value: SliderValue
  table: string
  column: string
  type: string
}

export interface SliderCollection {
  sliders: SliderItem[]
}

const initialState: SliderCollection = {
  sliders: []
}

const sliders = createSlice({
  name: 'sliders',
  initialState,
  reducers: {
    updateSliderValue(state: SliderCollection, { payload }: PayloadAction<SliderItem>) {
      const { name, value, table, column, type } = payload
      const s = state.sliders.find((x: SliderItem): boolean => x.name === name)
      if (s !== undefined) {
        s.value = { min: value.min, max: value.max }
      } else {
        state.sliders.push({ name, value, table, column, type })
      }
    }
  }
})

export const { updateSliderValue } = sliders.actions
export default sliders.reducer
