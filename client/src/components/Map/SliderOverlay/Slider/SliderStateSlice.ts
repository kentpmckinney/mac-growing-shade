import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SliderItem {
  name: string
  value: number
}

export interface SliderCollection {
  sliders: SliderItem[]
}

const initialState: SliderCollection = {
  sliders: []
};

/*
  import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
  import { userAPI } from './userAPI'
  const fetchUserById = createAsyncThunk(
    'users/fetchByIdStatus',
    async (userId, thunkAPI) => {
      const response = await userAPI.fetchById(userId);
      return response.data;
    }
  )
*/

const sliders = createSlice({
  name: 'sliders',
  initialState,
  reducers: {
    updateSliderValue(state: SliderCollection, { payload }: PayloadAction<SliderItem>) {
      const { name, value } = payload;
      let s = state.sliders.find( (x: SliderItem): boolean => x.name === name );
      if (s !== undefined)
      {
        s.value = value;
      }
      else {
        state.sliders.push({name, value});
      }
    },
  },
  extraReducers: {
    /*
      [fetchUserById.fulfilled]: (state, action) => {
        // Add user to the state array
        state.entities.push(action.payload)
      }
    */
  }
});

/*
  // Later, dispatch the thunk as needed in the app
  dispatch(fetchUserById(123));
*/

export const { updateSliderValue } = sliders.actions;
export default sliders.reducer;