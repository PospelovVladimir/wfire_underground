import { COLS, GRID, ROWS } from "../constants";
import type { Point } from "../types";

export const findPath = (start: Point, end: Point) => {
  const openSet = [start];
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  const key = (p) => `${p.x},${p.y}`;
  const h = (p) => {
    const dx = Math.abs(p.x - end.x);
    const dy = Math.abs(p.y - end.y);
    return dx + dy + (Math.sqrt(2) - 2) * Math.min(dx, dy);
  };

  gScore.set(key(start), 0);
  fScore.set(key(start), h(start));

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore.get(key(a)) - fScore.get(key(b)));
    const current = openSet.shift();

    if (current.x === end.x && current.y === end.y) {
      const path = [current];
      let currKey = key(current);
      while (cameFrom.has(currKey)) {
        const p = cameFrom.get(currKey);
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
      if (nb.x < 0 || nb.x >= COLS || nb.y < 0 || nb.y >= ROWS) continue;
      if (GRID[nb.y][nb.x] === 1) continue;

      if (nb.cost > 1) {
        if (GRID[current.y][nb.x] === 1 || GRID[nb.y][current.x] === 1)
          continue;
      }

      const tentG = gScore.get(key(current)) + nb.cost;
      if (!gScore.has(key(nb)) || tentG < gScore.get(key(nb))) {
        cameFrom.set(key(nb), current);
        gScore.set(key(nb), tentG);
        fScore.set(key(nb), tentG + h(nb));
        if (!openSet.some((p) => p.x === nb.x && p.y === nb.y))
          openSet.push(nb);
      }
    }
  }
  return [];
};
