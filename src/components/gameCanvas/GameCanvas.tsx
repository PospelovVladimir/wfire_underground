import React, { useEffect, useRef, useState } from "react";
import { TILE_SIZE } from "../../constants";
import { findPath } from "../../engine/pathfinder";
import { checkPickups, updatePlayerPhysics } from "../../engine/physics";
import { drawGame, updateCamera } from "../../engine/renderer";
import { createProceduralTextures } from "../../engine/textures";
import { type Item, type Point } from "../../types";

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gold, setGold] = useState(0); // Золото в стейте для UI

  // Основной стейт игры в Ref (для скорости 60fps)
  const gameRef = useRef({
    player: { x: 1, y: 1, realX: 48, realY: 48, path: [] as Point[], gold: 0 },
    items: [
      { id: 1, x: 5, y: 5, amount: 100 },
      { id: 2, x: 20, y: 15, amount: 50 },
    ] as Item[],
    camera: { x: 0, y: 0 },
    textures: null as HTMLCanvasElement | null,
  });

  // Клик мышкой
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const { camera, player } = gameRef.current;

    // Считаем мировые координаты клика (экран + камера)
    const mouseX = e.clientX - rect.left + camera.x;
    const mouseY = e.clientY - rect.top + camera.y;

    const targetX = Math.floor(mouseX / TILE_SIZE);
    const targetY = Math.floor(mouseY / TILE_SIZE);

    // Вычисляем путь
    const startNode = { x: Math.round(player.x), y: Math.round(player.y) };
    const endNode = { x: targetX, y: targetY };

    const newPath = findPath(startNode, endNode);
    if (newPath.length > 0) {
      gameRef.current.player.path = newPath;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. ГЕНЕРИРУЕМ ТЕКСТУРЫ ОДИН РАЗ ПРИ МОНТИРОВАНИИ:
    gameRef.current.textures = createProceduralTextures();

    // 2. Ресайз экрана
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // 3. Запуск игрового цикла
    let frameId: number;
    const loop = () => {
      const state = gameRef.current;

      // Плавное перемещение игрока
      updatePlayerPhysics(state.player);

      // Проверка подбора предметов
      state.items = checkPickups(state.player, state.items, (item) => {
        setGold((prev) => prev + item.amount);
      });

      // обновление камеры
      state.camera = updateCamera(state.player, canvas.width, canvas.height);

      // state.textures передаются прямо в отрисовщик:
      drawGame(ctx, state.player, state.items, state.camera, state.textures);

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="game-wrapper"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        style={{ display: "block" }}
      />
      {/* UI поверх Canvas */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "gold",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        💰 Gold: {gold}
      </div>
    </div>
  );
};
