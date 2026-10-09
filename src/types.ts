export interface Point {
  x: number;
  y: number;
}

export interface Item extends Point {
  id: number;
  amount: number;
}

export interface PlayerState extends Point {
  realX: number;
  realY: number;
  path: Point[];
  gold: number;
}
