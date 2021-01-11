import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Slider {
  name: string
  value: number
}

interface SliderCollection {
  sliders: Slider[]
}

const initialState: SliderCollection = {
  sliders: []
};

const sliders = createSlice({
  name: 'sliders',
  initialState,
  reducers: {
    updateSliderValue(state, { payload }: PayloadAction<Slider>) {
      const { name, value } = payload;
      let test = [{name: 'first', value: 1},{name: 'second', value: 2},{name: 'third', value: 3}];
      let s = state.sliders.find(x => x.name === name);
      if (s !== undefined)
      {
        s.value = value;
      }
      else {
        state.sliders.push({name, value});
      }
    },
  },
});

export const { updateSliderValue } = sliders.actions;
export default sliders.reducer;