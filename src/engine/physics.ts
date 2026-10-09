import { TILE_SIZE } from "../constants";
import { type Item, type PlayerState } from "../types";

// Плавное перемещение игрока
export const updatePlayerPhysics = (player: PlayerState) => {
  if (player.path.length > 0) {
    const target = player.path[0];
    const targetPxX = target.x * TILE_SIZE;
    const targetPxY = target.y * TILE_SIZE;

    const dx = targetPxX - player.realX;
    const dy = targetPxY - player.realY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const speedPx = 5; // Скорость в пикселях за кадр

    if (dist < speedPx) {
      // Дошли до узла пути
      player.realX = targetPxX;
      player.realY = targetPxY;
      player.x = target.x;
      player.y = target.y;
      player.path.shift(); // Удаляем пройденную точку
    } else {
      // Двигаемся к узлу
      player.realX += (dx / dist) * speedPx;
      player.realY += (dy / dist) * speedPx;
      // Обновляем логические координаты для A*
      player.x = player.realX / TILE_SIZE;
      player.y = player.realY / TILE_SIZE;
    }
  }
};

// Проверка подбора предметов
export const checkPickups = (
  player: PlayerState,
  items: Item[],
  onPickup: (item: Item) => void
): Item[] => {
  return items.filter((item) => {
    const dist = Math.hypot(player.x - item.x, player.y - item.y);
    if (dist < 0.6) {
      onPickup(item); // Коллбэк для Redux/State
      return false; // Удаляем из массива на земле
    }
    return true;
  });
};
