import type { Point } from "../types";

export const findPath = (
  start: Point,
  end: Point,
  grid: number[][]
): Point[] => {
  // Защита: если сетка пустая, сразу возвращаем пустой путь
  if (!grid || grid.length === 0 || !grid[0]) return [];

  // 1. ДИНАМИЧЕСКИ ВЫЧИСЛЯЕМ РАЗМЕРЫ КАРТЫ ИЗ ПЕРЕДАННОЙ СЕТКИ
  const rows = grid.length;
  const cols = grid[0].length;

  const openSet: Point[] = [start];
  const cameFrom = new Map<string, Point>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  const key = (p: Point) => `${p.x},${p.y}`;
  const h = (p: Point) => {
    const dx = Math.abs(p.x - end.x);
    const dy = Math.abs(p.y - end.y);
    return dx + dy + (Math.sqrt(2) - 2) * Math.min(dx, dy);
  };

  gScore.set(key(start), 0);
  fScore.set(key(start), h(start));

  while (openSet.length > 0) {
    openSet.sort(
      (a, b) => (fScore.get(key(a)) ?? 0) - (fScore.get(key(b)) ?? 0)
    );
    const current = openSet.shift()!;

    if (current.x === end.x && current.y === end.y) {
      const path: Point[] = [current];
      let currKey = key(current);
      while (cameFrom.has(currKey)) {
        const p = cameFrom.get(currKey)!;
        path.unshift(p);
        currKey = key(p);
      }
      return path;
    }

    const neighbors = [
      { x: current.x + 1, y: current.y, cost: 1 },
      { x: current.x - 1, y: current.y, cost: 1 },
      { x: current.x, y: current.y + 1, cost: 1 },
      { x: current.x, y: current.y - 1, cost: 1 },
      { x: current.x + 1, y: current.y + 1, cost: Math.sqrt(2) },
      { x: current.x - 1, y: current.y - 1, cost: Math.sqrt(2) },
      { x: current.x + 1, y: current.y - 1, cost: Math.sqrt(2) },
      { x: current.x - 1, y: current.y + 1, cost: Math.sqrt(2) },
    ];

    for (let nb of neighbors) {
      // 2. ИСПОЛЬЗУЕМ cols И rows ДЛЯ ПРОВЕРКИ ГРАНИЦ
      if (nb.x < 0 || nb.x >= cols || nb.y < 0 || nb.y >= rows) continue;

      // 3. ИСПОЛЬЗУЕМ ВХОДНОЙ grid ВМЕСТО ГЛОБАЛЬНОГО GRID (ЛЮБАЯ СТЕНА !== 0 НЕПРОХОДИМА)
      if (grid[nb.y][nb.x] !== 0) continue;

      // Проверка прорезания углов при диагоналях (нельзя идти сквозь стены)
      if (nb.cost > 1) {
        if (grid[current.y][nb.x] !== 0 || grid[nb.y][current.x] !== 0) {
          continue;
        }
      }

      const tentG = (gScore.get(key(current)) ?? 0) + nb.cost;
      if (!gScore.has(key(nb)) || tentG < (gScore.get(key(nb)) ?? Infinity)) {
        cameFrom.set(key(nb), current);
        gScore.set(key(nb), tentG);
        fScore.set(key(nb), tentG + h(nb));
        if (!openSet.some((p) => p.x === nb.x && p.y === nb.y)) {
          openSet.push(nb);
        }
      }
    }
  }
  return [];
};
