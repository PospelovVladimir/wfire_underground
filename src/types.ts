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

export interface PropItem {
  id: string;
  type: "shovel" | "axe" | "small_rock" | "barrel" | "torch";
  x: number; // Позиция на полу (можно дробную, например 4.3)
  z: number;
  rotationY?: number; // Угол поворота в радианах (или градусах)
  scale?: number; // Масштаб
}

export interface LevelData {
  id: number;
  name: string;
  grid: number[][]; // Твой массив стен (0, 1, 2...)
  playerStart: { x: number; z: number };
  items: Item[]; // Золото, подбираемые вещи
  decorations: PropItem[]; // Чистый декор
}
