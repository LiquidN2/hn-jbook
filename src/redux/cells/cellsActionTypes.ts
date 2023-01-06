export enum ActionType {
  MOVE_CELL = 'move_cell',
  DELETE_CELL = 'delete_cell',
  INSERT_CELL_BEFORE = ' insert_cell_before',
  UPDATE_CELL = 'update_cell',
}

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: { id: string; direction: 'up' | 'down' };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

export interface InsertCellBeforeAction {
  type: ActionType.INSERT_CELL_BEFORE;
  payload: { id: string; type: 'code' | 'text' };
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: { id: string; content: string };
}

export type CellsAction =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellBeforeAction
  | UpdateCellAction;
