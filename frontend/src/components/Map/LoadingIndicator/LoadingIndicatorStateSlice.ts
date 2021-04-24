import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type LoadingMessage = {
  message: string
}

const initialState: LoadingMessage = {
  message: 'Loading Map...'
}

const sliders = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    updateLoadingMessage(state: LoadingMessage, { payload }: PayloadAction<LoadingMessage>) {
      const { message } = payload
      state.message = message
    }
  }
})

export const { updateLoadingMessage } = sliders.actions
export default sliders.reducer
