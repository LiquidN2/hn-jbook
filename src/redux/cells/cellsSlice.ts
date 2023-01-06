import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { CellTypes, Cell, Direction } from './cellsTypes';
import { randomId } from '../../utils/randomId';

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: { [key: string]: Cell };
}

const cellOne: Cell = {
  id: randomId(),
  content: 'console.log(123)',
  type: 'code',
};

const cellTwo: Cell = {
  id: randomId(),
  content: 'This is a text cell',
  type: 'text',
};

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [cellOne.id, cellTwo.id],
  data: {
    [cellOne.id]: cellOne,
    [cellTwo.id]: cellTwo,
  },
};

export const cellsSlice = createSlice({
  name: 'cells',
  initialState,
  reducers: {
    move: (
      state: CellsState,
      action: PayloadAction<{ id: string; direction: Direction }>
    ) => {
      const { id, direction } = action.payload;

      // locate index of cell ids to be swapped
      const index = state.order.indexOf(id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      // Check if target index is outside array boundaries
      if (targetIndex < 0 || targetIndex > state.order.length - 1) return;

      // swap cell ids
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = id;
    },

    remove: (state: CellsState, action: PayloadAction<string>) => {
      const cellIdToRemove = action.payload;

      // Delete cell obj from data
      delete state.data[cellIdToRemove];

      // Delete cell id from order
      const index = state.order.indexOf(cellIdToRemove);
      if (index > -1) state.order.splice(index, 1);
    },

    insertBefore: (
      state: CellsState,
      action: PayloadAction<{ id: string | null; type: CellTypes }>
    ) => {
      // create new cell obj
      const cell: Cell = {
        id: randomId(),
        type: action.payload.type,
        content: '',
      };

      // store object in state data
      state.data[cell.id] = cell;

      // if payload provide id, insert new cell id before that id
      // if no payload id, append new cell id at the end
      const foundIndex = action.payload.id
        ? state.order.indexOf(action.payload.id)
        : -1;

      if (foundIndex > -1) {
        state.order.splice(foundIndex, 0, cell.id);
        return;
      }
      state.order.push(cell.id);
    },

    update: (
      state: CellsState,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },
  },
});

export const { move, remove, insertBefore, update } = cellsSlice.actions;

export default cellsSlice.reducer;
