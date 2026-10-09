import { COLS, GRID, ROWS, TILE_SIZE } from "../constants";
import { type Item, type PlayerState, type Point } from "../types";

// УМНАЯ КАМЕРА
export const updateCamera = (
  player: PlayerState,
  viewWidth: number,
  viewHeight: number
) => {
  const mapWidthPx = COLS * TILE_SIZE;
  const mapHeightPx = ROWS * TILE_SIZE;
  let x = 0;
  let y = 0;

  // Центрируем или следим по X
  if (mapWidthPx > viewWidth) {
    x = player.realX - viewWidth / 2 + TILE_SIZE / 2;
    x = Math.max(0, Math.min(x, mapWidthPx - viewWidth));
  } else {
    x = -(viewWidth - mapWidthPx) / 2;
  }

  // Центрируем или следим по Y
  if (mapHeightPx > viewHeight) {
    y = player.realY - viewHeight / 2 + TILE_SIZE / 2;
    y = Math.max(0, Math.min(y, mapHeightPx - viewHeight));
  } else {
    y = -(viewHeight - mapHeightPx) / 2;
  }

  return { x, y };
};

// ОТРИСОВКА
export const drawGame = (
  ctx: CanvasRenderingContext2D,
  player: PlayerState,
  items: Item[],
  camera: Point,
  textures: HTMLCanvasElement | null
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.save();
  ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));

  // 1. Карта
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const tileType = GRID[row][col];
      if (textures) {
        ctx.drawImage(
          textures,
          tileType * TILE_SIZE,
          0,
          TILE_SIZE,
          TILE_SIZE,
          col * TILE_SIZE,
          row * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }
  }

  // 2. Путь (Линия)
  if (player.path.length > 0) {
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.moveTo(player.realX + TILE_SIZE / 2, player.realY + TILE_SIZE / 2);
    player.path.forEach((p) =>
      ctx.lineTo(
        p.x * TILE_SIZE + TILE_SIZE / 2,
        p.y * TILE_SIZE + TILE_SIZE / 2
      )
    );
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 3. Золото
  const float = Math.sin(Date.now() / 250) * 5;
  items.forEach((item) => {
    const ix = item.x * TILE_SIZE;
    const iy = item.y * TILE_SIZE + float;
    if (textures) {
      ctx.drawImage(
        textures,
        TILE_SIZE * 2,
        0,
        TILE_SIZE,
        TILE_SIZE,
        ix,
        iy,
        TILE_SIZE,
        TILE_SIZE
      );
    }
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${item.amount}g`, ix + TILE_SIZE / 2, iy - 5);
  });

  // 4. Игрок
  ctx.fillStyle = "#6366f1";
  ctx.beginPath();
  ctx.arc(
    player.realX + TILE_SIZE / 2,
    player.realY + TILE_SIZE / 2,
    16,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
};
