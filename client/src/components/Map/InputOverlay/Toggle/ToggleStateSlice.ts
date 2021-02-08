import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToggleItem {
  name: string
  value: string
  table: string
  column: string
  type: string
}

export interface ToggleCollection {
  toggles: ToggleItem[]
}

const initialState: ToggleCollection = {
  toggles: []
};

const toggles = createSlice({ 
  name: 'toggles',
  initialState,
  reducers: {
    updateToggleValue(state: ToggleCollection, { payload }: PayloadAction<ToggleItem>) {
      const { name, value, table, column, type } = payload;
      let s = state.toggles.find( (x: ToggleItem): boolean => x.name === name );
      if (s !== undefined)
      {
        s.value = value;
      }
      else {
        state.toggles.push({name, value, table, column, type});
      }
    },
  }
});

export const { updateToggleValue } = toggles.actions;
export default toggles.reducer;