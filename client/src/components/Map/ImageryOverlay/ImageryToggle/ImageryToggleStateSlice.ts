import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ImageryOptions {
  enabled: boolean
}

const initialState: ImageryOptions = {
  enabled: false
};

const imagery = createSlice({
  name: 'imagery',
  initialState,
  reducers: {
    updateImageryValue(state: ImageryOptions, { payload }: PayloadAction<ImageryOptions>) {
      state.enabled = payload.enabled;
    },
  },
});

export const { updateImageryValue } = imagery.actions;
export default imagery.reducer;