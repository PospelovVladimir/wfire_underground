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
  type:
    | "flashlight"
    | "barrel"
    | "log"
    | "shovel"
    | "axe"
    | "small_rock"
    | "barrel"
    | "torch"
    | "log"
    | "grass";
  x: number; // Позиция по X на сетке
  z: number; // Позиция по Z на сетке
  y?: number; // ВЫСОТА: 0 - на полу, 1.5 - висит на стене/в воздухе
  rotationY?: number; // Поворот вокруг своей оси
  rotationX?: number; // Наклон вперед/назад (например, для факела под углом)
  scale?: number; // Масштаб
  isSolid?: boolean; // ТВЕРДОСТЬ: true - нельзя пройти (бревно, бочка), false - можно пройти (трава)
}

export interface LevelData {
  id: number;
  name: string;
  grid: number[][]; // Твой массив стен (0, 1, 2...)
  playerStart: { x: number; z: number };
  items: Item[]; // Золото, подбираемые вещи
  decorations: PropItem[]; // Чистый декор
}
