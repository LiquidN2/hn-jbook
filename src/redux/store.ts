import { configureStore } from '@reduxjs/toolkit';

import cellsReducer from './cells/cellsSlice';

export const store = configureStore({
  reducer: {
    cells: cellsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
