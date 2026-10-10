import { useGLTF, useTexture } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import React, { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { TILE_SIZE } from "../../constants";
import { findPath } from "../../engine/pathfinder";
import { WALL_TYPES } from "../../tiles";
import {
  type Item,
  type LevelData,
  type PlayerState,
  type Point,
} from "../../types";

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
// const Wall: React.FC<{ x: number; z: number }> = ({ x, z }) => {
//   // Загружаем текстурные карты камня.
//   // Положи эти файлы картинок в папку public/textures/
//   const stoneTextures = useTexture({
//     map: "/textures/stone_color.png", // Основной цвет камня
//     normalMap: "/textures/stone_normal.png", // Карта рельефа (создает объемные трещины)
//     roughnessMap: "/textures/stone_rough.png", // Карта матовости/блеска
//   });

//   // Настройки повторения текстуры на блоке
//   Object.values(stoneTextures).forEach((texture) => {
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//   });

//   return (
//     <mesh position={[x + 0.5, 0.75, z + 0.5]} castShadow receiveShadow>
//       <boxGeometry args={[1, 1.5, 1]} />
//       {/* Применяем текстурный пак камня к материалу стены */}
//       <meshStandardMaterial
//         {...stoneTextures}
//         roughness={0.8}
//         metalness={0.1}
//       />
//     </mesh>
//   );
// };

// interface RockWallProps {
//   x: number;
//   z: number;
// }

// Псевдослучайное число на основе координат (детерминированное, не скачет при ререндере)
// const getSeed = (x: number, z: number, offset: number) => {
//   const val = Math.sin(x * 12.9898 + z * 78.233 + offset * 43758.5453);
//   return val - Math.floor(val);
// };

// export const RockWall: React.FC<RockWallProps> = ({ x, z }) => {
//   // 1. Загружаем 3D-модель из папки public/models/
//   // useGLTF кэширует файл: сколько бы стен ни было на карте, файл скачивается ровно 1 раз!
//   const { scene } = useGLTF("/models/rock_wall2.glb");

//   // 2. Делаем глубокую копию сцены для этой конкретной клетки и задаем случайный поворот/масштаб
//   const { clonedScene, rotationY, scaleFactor, offsetY } = useMemo(() => {
//     const clone = scene.clone(true);

//     // Включаем тени для всех мешей внутри модели
//     clone.traverse((child) => {
//       if ((child as THREE.Mesh).isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });

//     const s1 = getSeed(x, z, 1);
//     const s2 = getSeed(x, z, 2);

//     // Поворот на 0, 90, 180 или 270 градусов, чтобы скрыть повторяемость
//     const angles = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2];
//     const rot = angles[Math.floor(s1 * angles.length)];

//     // Небольшой разброс по масштабу и высоте для органичности скалы
//     const scale = 0.95 + s2 * 0.25; // от 0.95 до 1.2
//     const yShift = (s1 - 0.5) * 0.1;

//     return {
//       clonedScene: clone,
//       rotationY: rot,
//       scaleFactor: scale,
//       offsetY: yShift,
//     };
//   }, [scene, x, z]);

//   return (
//     <group position={[x + 0.5, offsetY, z + 0.5]}>
//       <primitive
//         object={clonedScene}
//         rotation={[0, rotationY, 0]}
//         scale={[scaleFactor, scaleFactor * 1.5, scaleFactor]} // вытягиваем чуть вверх
//       />
//     </group>
//   );
// };

interface RockWallProps {
  x: number;
  z: number;
  tileId: number;
}

// Псевдослучайный генератор, чтобы случайные повороты не менялись при ререндерах
const getSeed = (x: number, z: number, offset: number) => {
  const val = Math.sin(x * 12.9898 + z * 78.233 + offset * 43758.5453);
  return val - Math.floor(val);
};

export const RockWall: React.FC<RockWallProps> = ({ x, z, tileId }) => {
  const config = WALL_TYPES[tileId] || WALL_TYPES[1];

  // Загружаем нужную модельку по пути из конфига
  const { scene } = useGLTF(config.modelPath);

  const { clonedScene, rotationY, scaleX, scaleY, scaleZ } = useMemo(() => {
    const clone = scene.clone(true);

    // Включаем тени для всех мешей модели
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    const s1 = getSeed(x, z, 1);
    const s2 = getSeed(x, z, 2);

    // 4 случайных поворота (0, 90, 180, 270 град)
    const angles = [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2];
    const rot = angles[Math.floor(s1 * angles.length)];

    // Небольшой разброс размера для природной неоднородности
    const randomVariation = 0.95 + s2 * 0.15; // 0.95 - 1.10
    const finalScale = config.baseScale * randomVariation;
    const height = finalScale * (config.heightMultiplier || 1.4);

    return {
      clonedScene: clone,
      rotationY: rot,
      scaleX: finalScale,
      scaleY: height,
      scaleZ: finalScale,
    };
  }, [scene, x, z, config]);

  return (
    <group position={[x + 0.5, 0, z + 0.5]}>
      <primitive
        object={clonedScene}
        rotation={[0, rotationY, 0]}
        scale={[scaleX, scaleY, scaleZ]}
      />
    </group>
  );
};

// Предзагрузка всех моделей разом при старте игры
Object.values(WALL_TYPES).forEach((cfg) => {
  useGLTF.preload(cfg.modelPath);
});

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
// const Floor: React.FC<{ gameRef: any }> = ({ gameRef }) => {
//   // 1. Загружаем карты текстур пола из public/textures/
//   const floorTextures = useTexture({
//     map: "/textures/floor_color.png",
//     normalMap: "/textures/floor_normal.png",
//     roughnessMap: "/textures/floor_rough.png",
//   });

//   // 2. Настраиваем тайлинг: повторяем текстуру ровно по числу плиток (COLS x ROWS)
//   useLayoutEffect(() => {
//     Object.values(floorTextures).forEach((texture) => {
//       texture.wrapS = THREE.RepeatWrapping;
//       texture.wrapT = THREE.RepeatWrapping;
//       // 1 повтор на каждую плитку (25 по горизонтали, 20 по вертикали)
//       texture.repeat.set(COLS, ROWS);
//       texture.needsUpdate = true;
//     });
//   }, [floorTextures]);

//   // 3. Обработчик клика (с защитой от дёргания при частых кликах)
//   const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
//     e.stopPropagation();
//     const targetX = Math.floor(e.point.x);
//     const targetZ = Math.floor(e.point.z);
//     const { player } = gameRef.current;

//     if (GRID[targetZ] && GRID[targetZ][targetX] === 0) {
//       const startNode =
//         player.path.length > 0
//           ? { x: player.path[0].x, y: player.path[0].y }
//           : {
//               x: Math.floor(player.realX / TILE_SIZE),
//               y: Math.floor(player.realY / TILE_SIZE),
//             };

//       const newPath = findPath(startNode, { x: targetX, y: targetZ });
//       if (newPath.length > 0) {
//         player.path = newPath;
//       }
//     }
//   };

//   return (
//     <mesh
//       rotation={[-Math.PI / 2, 0, 0]}
//       position={[COLS / 2, 0, ROWS / 2]}
//       onPointerDown={handlePointerDown}
//       receiveShadow
//     >
//       <planeGeometry args={[COLS, ROWS]} />
//       {/* Накладываем PBR-материал пола */}
//       <meshStandardMaterial
//         {...floorTextures}
//         roughness={0.85}
//         metalness={0.1}
//       />
//     </mesh>
//   );
// };

interface FloorProps {
  gameRef: any;
  grid: number[][]; // Передаем сетку уровня
}

export const Floor: React.FC<FloorProps> = ({ gameRef, grid }) => {
  // Динамически определяем размеры карты по текущему уровню
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  // 1. Загрузка текстур пола из public/textures/
  const floorTextures = useTexture({
    map: "/textures/floor_color.png",
    normalMap: "/textures/floor_normal.png",
    roughnessMap: "/textures/floor_rough.png",
  });

  // 2. Тайлинг текстуры под размеры переданной сетки
  useLayoutEffect(() => {
    Object.values(floorTextures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      // Повторяем текстуру ровно столько раз, сколько плиток в ширину и длину
      texture.repeat.set(cols, rows);
      texture.needsUpdate = true;
    });
  }, [floorTextures, cols, rows]);

  // 3. Обработка клика мыши с учетом переданного grid
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    const targetX = Math.floor(e.point.x);
    const targetZ = Math.floor(e.point.z);
    const { player } = gameRef.current;

    // Проверяем проходимость клетки (0 - свободный пол)
    if (grid[targetZ] && grid[targetZ][targetX] === 0) {
      // Если игрок уже в движении, стартуем со следующей точки маршрута,
      // чтобы избежать дерганий при частых кликах
      const startNode =
        player.path.length > 0
          ? { x: player.path[0].x, y: player.path[0].y }
          : {
              x: Math.floor(player.realX / TILE_SIZE),
              y: Math.floor(player.realY / TILE_SIZE),
            };

      // Передаем grid в findPath (если твой алгоритм принимает сетку параметром)
      const newPath = findPath(startNode, { x: targetX, y: targetZ }, grid);
      if (newPath && newPath.length > 0) {
        player.path = newPath;
      }
    }
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      // Центрируем плоскость строго под текущую сетку карты
      position={[cols / 2, 0, rows / 2]}
      onPointerDown={handlePointerDown}
      receiveShadow
    >
      {/* Размер плоскости соответствует числу плиток (1 единица Three.js = 1 плитка) */}
      <planeGeometry args={[cols, rows]} />
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
// export const GameScene: React.FC<GameSceneProps> = ({ gameRef, items }) => {
//   return (
//     <>
//       {/* <color attach="background" args={["#020617"]} /> */}
//       {/* <fog attach="fog" args={["#020617", 5, 15]} /> */}

//       <IsometricCamera gameRef={gameRef} />

//       <ambientLight intensity={0.05} />

//       {/* Обернем стены в Suspense на время загрузки текстур камня */}
//       <Suspense fallback={null}>
//         <Floor gameRef={gameRef} />

//         {/* {GRID.map((row, z) =>
//           row.map((tile, x) =>
//             tile === 1 ? <Wall key={`wall-${x}-${z}`} x={x} z={z} /> : null
//           )
//         )} */}

//         {/* Стены из настоящих 3D-моделей скал */}
//         {/* {GRID.map((row, z) =>
//           row.map((tile, x) =>
//             tile === 1 ? <RockWall key={`rock-${x}-${z}`} x={x} z={z} /> : null
//           )
//         )} */}

//         {/* Единый рендер любых стен по ID плитки */}
//         {GRID.map((row, z) =>
//           row.map((tileId, x) =>
//             tileId > 0 ? (
//               <RockWall key={`wall-${x}-${z}`} x={x} z={z} tileId={tileId} />
//             ) : null
//           )
//         )}
//       </Suspense>

//       {GRID.map((row, z) =>
//         row.map((tile, x) =>
//           tile === 3 ? <Lamp key={`wall-${x}-${z}`} x={x} z={z} /> : null
//         )
//       )}

//       {/* Отрисовка реактивного списка монет */}
//       <GoldCoins items={items} />

//       <Player3D gameRef={gameRef} />
//     </>
//   );
// };

interface GameSceneProps {
  gameRef: any;
  level: LevelData; // Все данные уровня здесь!
  items: Item[]; // Текущие оставшиеся монеты
}

export const GameScene: React.FC<GameSceneProps> = ({
  gameRef,
  level,
  items,
}) => {
  return (
    <>
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 5, 16]} />

      <IsometricCamera gameRef={gameRef} />
      <ambientLight intensity={0.06} />

      <Suspense fallback={null}>
        {/* Пол строится по размеру карты уровня */}
        <Floor gameRef={gameRef} grid={level.grid} />

        {/* Стены строятся по сетке уровня */}
        {level.grid.map((row, z) =>
          row.map((tileId, x) =>
            tileId > 0 ? (
              <RockWall key={`wall-${x}-${z}`} x={x} z={z} tileId={tileId} />
            ) : null
          )
        )}

        {/* Декорации (лопаты, топоры) из уровня */}
        {/* {level.decorations.map((prop) => (
          <DecorationProp key={prop.id} prop={prop} />
        ))} */}
      </Suspense>

      {/* Золото и Персонаж */}
      <GoldCoins items={items} />
      <Player3D gameRef={gameRef} />
    </>
  );
};
