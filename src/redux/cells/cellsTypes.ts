export type Direction = 'up' | 'down';

export type CellTypes = 'code' | 'text';

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
