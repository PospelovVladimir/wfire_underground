import { type PropItem } from "../types";

export const getWalkableGrid = (
  baseGrid: number[][],
  decorations: PropItem[]
): number[][] => {
  // 1. Делаем копию базовой сетки стен
  const gridCopy = baseGrid.map((row) => [...row]);

  // 2. Находим предметы с isSolid: true и перекрываем под ними клетки
  decorations.forEach((prop) => {
    if (prop.isSolid) {
      const tileX = Math.floor(prop.x);
      const tileZ = Math.floor(prop.z);

      if (gridCopy[tileZ] && gridCopy[tileZ][tileX] !== undefined) {
        gridCopy[tileZ][tileX] = 1; // Помечаем клетку как непроходимую стену
      }
    }
  });

  return gridCopy;
};
