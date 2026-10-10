import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { checkPickups, updatePlayerPhysics } from "../../engine/physics";
import { type Item, type PlayerState, type Point } from "../../types";
import { GameScene } from "../gameScene/GameScene";

export const GameCanvas: React.FC = () => {
  const [gold, setGold] = useState(0);

  const [items, setItems] = useState<Item[]>([
    { id: 1, x: 23, y: 1, amount: 100 },
    { id: 2, x: 1, y: 17, amount: 150 },
    { id: 3, x: 13, y: 5, amount: 250 },
    { id: 4, x: 7, y: 13, amount: 75 },
    { id: 5, x: 23, y: 17, amount: 500 },
  ]);

  const gameRef = useRef({
    player: {
      x: 1,
      y: 1,
      realX: 48,
      realY: 48,
      path: [] as Point[],
      gold: 0,
    } as PlayerState,
    items: [] as Item[],
    camera: { x: 0, y: 0 },
    textures: null,
  });

  useEffect(() => {
    gameRef.current.items = items;
  }, []);

  useEffect(() => {
    let frameId: number;
    const loop = () => {
      const state = gameRef.current;

      updatePlayerPhysics(state.player);

      const remainingItems = checkPickups(
        state.player,
        state.items,
        (pickedItem) => {
          setGold((prev) => prev + pickedItem.amount);
        }
      );

      if (remainingItems.length !== state.items.length) {
        state.items = remainingItems;
        setItems(remainingItems);
      }

      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []); // <-- ПУСТОЙ МАССИВ ЗАВИСИМОСТЕЙ! Цикл работает стабильно и непрерывно

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
        <GameScene gameRef={gameRef} items={items} />
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
