import { useTexture } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { COLS, GRID, ROWS, TILE_SIZE } from "../../constants";
import { findPath } from "../../engine/pathfinder";
import { type Item, type PlayerState, type Point } from "../../types";

interface GameSceneProps {
  gameRef: React.MutableRefObject<{
    player: PlayerState;
    items: Item[];
    camera: Point;
  }>;
  items: Item[]; // Принимаем монеты как реактивный проп
}

// -------------------------------------------------------------
// 1. СТЕНЫ ПЕЩЕРЫ (С загрузкой каменных текстур)
// -------------------------------------------------------------
const Wall: React.FC<{ x: number; z: number }> = ({ x, z }) => {
  // Загружаем текстурные карты камня.
  // Положи эти файлы картинок в папку public/textures/
  const stoneTextures = useTexture({
    map: "/textures/stone_color.png", // Основной цвет камня
    normalMap: "/textures/stone_normal.png", // Карта рельефа (создает объемные трещины)
    roughnessMap: "/textures/stone_rough.png", // Карта матовости/блеска
  });

  // Настройки повторения текстуры на блоке
  Object.values(stoneTextures).forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  return (
    <mesh position={[x + 0.5, 0.75, z + 0.5]} castShadow receiveShadow>
      <boxGeometry args={[1, 1.5, 1]} />
      {/* Применяем текстурный пак камня к материалу стены */}
      <meshStandardMaterial
        {...stoneTextures}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
};

const Lamp: React.FC<{ x: number; z: number }> = ({ x, z }) => {
  // Загружаем текстурные карты камня.
  // Положи эти файлы картинок в папку public/textures/
  // const stoneTextures = useTexture({
  //   map: "/textures/stone_color.png", // Основной цвет камня
  //   normalMap: "/textures/stone_normal.png", // Карта рельефа (создает объемные трещины)
  //   roughnessMap: "/textures/stone_rough.png", // Карта матовости/блеска
  // });

  // Настройки повторения текстуры на блоке
  // Object.values(stoneTextures).forEach((texture) => {
  //   texture.wrapS = THREE.RepeatWrapping;
  //   texture.wrapT = THREE.RepeatWrapping;
  // });

  return (
    <mesh position={[x + 0.5, 0.75, z + 0.5]} castShadow receiveShadow>
      <boxGeometry args={[0, 0, 0]} />
      {/* Применяем текстурный пак камня к материалу стены */}
      {/* <meshStandardMaterial
        {...stoneTextures}
        roughness={0.8}
        metalness={0.1}
      /> */}
      <pointLight
        position={[0, 0.3, 0]}
        intensity={2}
        distance={5}
        color="#fef68a"
        castShadow
      />
    </mesh>
  );
};

// -------------------------------------------------------------
// 2. ЗОЛОТЫЕ МОНЕТЫ
// -------------------------------------------------------------
const GoldCoins: React.FC<{ items: Item[] }> = ({ items }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Каждая монетка крутится и плавно парит по синусоиде
    groupRef.current.children.forEach((child, idx) => {
      child.rotation.y = time * 2.5 + idx;
      child.position.y = 0.3 + Math.sin(time * 3 + idx) * 0.05;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item) => (
        <mesh
          key={item.id}
          position={[item.x + 0.5, 0.3, item.y + 0.5]}
          castShadow
        >
          <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

// -------------------------------------------------------------
// 3. ИГРОК
// -------------------------------------------------------------
const Player3D: React.FC<{ gameRef: any }> = ({ gameRef }) => {
  const playerGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!playerGroupRef.current) return;
    const { player } = gameRef.current;

    const targetX = player.realX / TILE_SIZE + 0.5;
    const targetZ = player.realY / TILE_SIZE + 0.5;

    playerGroupRef.current.position.x = targetX;
    playerGroupRef.current.position.z = targetZ;
  });

  return (
    <group ref={playerGroupRef} position={[1.5, 0, 1.5]}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#6366f1" roughness={0.3} />
      </mesh>
      <pointLight
        position={[0, 0.6, 0]}
        intensity={20}
        distance={8}
        color="#fef08a"
        castShadow
      />
    </group>
  );
};

// -------------------------------------------------------------
// 4. ПОЛ (Клики мыши)
// -------------------------------------------------------------
const Floor: React.FC<{ gameRef: any }> = ({ gameRef }) => {
  // 1. Загружаем карты текстур пола из public/textures/
  const floorTextures = useTexture({
    map: "/textures/floor_color.png",
    normalMap: "/textures/floor_normal.png",
    roughnessMap: "/textures/floor_rough.png",
  });

  // 2. Настраиваем тайлинг: повторяем текстуру ровно по числу плиток (COLS x ROWS)
  useLayoutEffect(() => {
    Object.values(floorTextures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // 1 повтор на каждую плитку (25 по горизонтали, 20 по вертикали)
      texture.repeat.set(COLS, ROWS);
      texture.needsUpdate = true;
    });
  }, [floorTextures]);

  // 3. Обработчик клика (с защитой от дёргания при частых кликах)
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const targetX = Math.floor(e.point.x);
    const targetZ = Math.floor(e.point.z);
    const { player } = gameRef.current;

    if (GRID[targetZ] && GRID[targetZ][targetX] === 0) {
      const startNode =
        player.path.length > 0
          ? { x: player.path[0].x, y: player.path[0].y }
          : {
              x: Math.floor(player.realX / TILE_SIZE),
              y: Math.floor(player.realY / TILE_SIZE),
            };

      const newPath = findPath(startNode, { x: targetX, y: targetZ });
      if (newPath.length > 0) {
        player.path = newPath;
      }
    }
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[COLS / 2, 0, ROWS / 2]}
      onPointerDown={handlePointerDown}
      receiveShadow
    >
      <planeGeometry args={[COLS, ROWS]} />
      {/* Накладываем PBR-материал пола */}
      <meshStandardMaterial
        {...floorTextures}
        roughness={0.85}
        metalness={0.1}
      />
    </mesh>
  );
};

// -------------------------------------------------------------
// 5. ИЗОМЕТРИЧЕСКАЯ КАМЕРА (С более резким следованием)
// -------------------------------------------------------------
const IsometricCamera: React.FC<{ gameRef: any }> = ({ gameRef }) => {
  const { camera } = useThree();

  useFrame(() => {
    const { player } = gameRef.current;
    const playerX = player.realX / TILE_SIZE + 0.5;
    const playerZ = player.realY / TILE_SIZE + 0.5;

    // Оригинальные параметры высоты и отдаления
    // const cameraHeight = 11;
    // const cameraDistance = 9;
    const cameraHeight = 4;
    const cameraDistance = 5;

    // Оригинальный плавный коэффициент слежения (0.08)
    // пробовал на x z по 0.18 тоже хорошо. это и влияет на плавающую камеру
    camera.position.x += (playerX - camera.position.x) * 0.18;
    camera.position.y += (cameraHeight - camera.position.y) * 0.08;
    camera.position.z += (playerZ + cameraDistance - camera.position.z) * 0.18;

    camera.lookAt(playerX, 1.3, playerZ);
  });

  return null;
};

// -------------------------------------------------------------
// 6. ОСНОВНОЙ ЭКСПОРТ
// -------------------------------------------------------------
export const GameScene: React.FC<GameSceneProps> = ({ gameRef, items }) => {
  return (
    <>
      {/* <color attach="background" args={["#020617"]} /> */}
      {/* <fog attach="fog" args={["#020617", 5, 15]} /> */}

      <IsometricCamera gameRef={gameRef} />

      <ambientLight intensity={0.05} />

      {/* Обернем стены в Suspense на время загрузки текстур камня */}
      <Suspense fallback={null}>
        <Floor gameRef={gameRef} />

        {GRID.map((row, z) =>
          row.map((tile, x) =>
            tile === 1 ? <Wall key={`wall-${x}-${z}`} x={x} z={z} /> : null
          )
        )}
      </Suspense>

      {GRID.map((row, z) =>
        row.map((tile, x) =>
          tile === 3 ? <Lamp key={`wall-${x}-${z}`} x={x} z={z} /> : null
        )
      )}

      {/* Отрисовка реактивного списка монет */}
      <GoldCoins items={items} />

      <Player3D gameRef={gameRef} />
    </>
  );
};
