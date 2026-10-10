export interface WallConfig {
  modelPath: string;
  baseScale: number;
  heightMultiplier?: number;
}

// Реестр всех типов стен в игре
export const WALL_TYPES: Record<number, WallConfig> = {
  1: {
    modelPath: "/models/rock_wall2.glb", // Обычная пещера
    baseScale: 1.1,
    heightMultiplier: 1.5,
  },
  4: {
    modelPath: "/models/rock_wall.glb", // Замшелая стена
    baseScale: 0.7,
    heightMultiplier: 1.4,
  },
  5: {
    modelPath: "/models/glass.glb", // Трава
    baseScale: 1.0,
    heightMultiplier: 1.0,
  },
  6: {
    modelPath: "/models/log.glb", // Кирпичная стена для подземелья/комнаты
    baseScale: 0.9,
    heightMultiplier: 1.8,
  },
};
