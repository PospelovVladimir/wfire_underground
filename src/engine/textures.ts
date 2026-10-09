import { TILE_SIZE } from "../constants";

export const createProceduralTextures = (): HTMLCanvasElement => {
  const textures = document.createElement("canvas");
  textures.width = TILE_SIZE * 3;
  textures.height = TILE_SIZE;
  const tCtx = textures.getContext("2d");

  if (!tCtx) {
    throw new Error("Не удалось получить 2D контекст для текстур");
  }

  // --- 1. Пол / Трава (Тайлер 0) ---
  tCtx.fillStyle = "#0f172a";
  tCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
  tCtx.fillStyle = "#1e293b";
  for (let i = 0; i < 12; i++) {
    tCtx.fillRect((i * 17) % 40, (i * 9) % 40, 3, 3);
  }

  // --- 2. Стены пещеры / Камень (Тайлер 1) ---
  tCtx.fillStyle = "#312e81";
  tCtx.fillRect(TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
  tCtx.strokeStyle = "#4338ca";
  tCtx.lineWidth = 4;
  tCtx.strokeRect(TILE_SIZE + 4, 4, TILE_SIZE - 8, TILE_SIZE - 8);

  // --- 3. Монетка / Золото (Тайлер 2) ---
  tCtx.fillStyle = "#0f172a";
  tCtx.fillRect(TILE_SIZE * 2, 0, TILE_SIZE, TILE_SIZE);
  tCtx.beginPath();
  tCtx.arc(TILE_SIZE * 2.5, TILE_SIZE / 2, 14, 0, Math.PI * 2);
  tCtx.fillStyle = "#fbbf24";
  tCtx.fill();

  return textures;
};
