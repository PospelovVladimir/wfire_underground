import { Canvas } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { TILE_SIZE } from "../../constants";
import { getWalkableGrid } from "../../engine/gridUtils";
import { checkPickups, updatePlayerPhysics } from "../../engine/physics";
import { LEVEL_1 } from "../../levels/level1";
import { type Item, type PlayerState, type Point } from "../../types";
import { GameScene } from "../gameScene/GameScene";

export const GameCanvas: React.FC = () => {
  const currentLevel = LEVEL_1; // Текущий уровень

  const [gold, setGold] = useState(0);

  // 1. Предметы инициализируются ИЗ УРОВНЯ
  const [items, setItems] = useState<Item[]>(currentLevel.items);

  // 2. Игрок и внутренний стейт инициализируются ИЗ УРОВНЯ
  const gameRef = useRef({
    player: {
      x: currentLevel.playerStart.x,
      y: currentLevel.playerStart.z,
      realX: currentLevel.playerStart.x * TILE_SIZE,
      realY: currentLevel.playerStart.z * TILE_SIZE,
      path: [] as Point[],
      gold: 0,
    } as PlayerState,
    // Копия списка предметов для непрерывного 60fps-расчета коллизий:
    items: currentLevel.items as Item[],
    camera: { x: 0, y: 0 },
    textures: null,
  });

  // Игровой цикл
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      const state = gameRef.current;

      // Движение
      updatePlayerPhysics(state.player);

      // Проверка сбора предметов
      const remainingItems = checkPickups(
        state.player,
        state.items,
        (pickedItem) => {
          setGold((prev) => prev + pickedItem.amount);
        }
      );

      // Синхронизация: если подобрали предмет, обновляем и React, и Ref
      if (remainingItems.length !== state.items.length) {
        state.items = remainingItems; // для физики
        setItems(remainingItems); // для 3D-рендера сцены
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Вычисляем общую сетку с учетом и стен, и твердого декора:
  const walkableGrid = useMemo(() => {
    return getWalkableGrid(currentLevel.grid, currentLevel.decorations);
  }, [currentLevel]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#030712",
        position: "relative",
      }}
    >
      <Canvas shadows>
        {/* Передаем данные уровня и реактивные предметы в сцену */}
        <GameScene
          gameRef={gameRef}
          level={currentLevel}
          walkableGrid={walkableGrid}
          items={items}
        />
      </Canvas>

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#fbbf24",
          fontSize: 24,
          fontWeight: "bold",
          zIndex: 10,
        }}
      >
        💰 Gold: {gold}
      </div>
    </div>
  );
};
