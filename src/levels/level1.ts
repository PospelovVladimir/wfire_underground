import { type LevelData } from "../types";

export const LEVEL_1: LevelData = {
  id: 1,
  name: "Тестовая комната 1",
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 4],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 4],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  playerStart: { x: 1, z: 1 },
  items: [
    { id: 1, x: 5, y: 1, amount: 100 },
    { id: 2, x: 7, y: 3, amount: 250 },
  ],
  // Твой список декораций:
  decorations: [
    // {
    //   id: "torch_1",
    //   type: "torch",
    //   x: 2,
    //   z: 0.1,
    //   y: 1.2, // Поднят на стену
    //   rotationX: 0.3, // Слегка наклонен
    //   isSolid: false,
    // },
    {
      id: "log_1",
      type: "log",
      x: 5.2,
      z: 4.3,
      y: 0,
      rotationY: Math.PI / 4,
      scale: 1,
      isSolid: true,
    },
    {
      id: "log_2",
      type: "log",
      x: 7.2,
      z: 7.3,
      y: 0,
      rotationY: Math.PI / 4,
      scale: 0.8,
      isSolid: false,
    },
    {
      id: "barrel_1",
      type: "barrel",
      x: 2,
      z: 2.3,
      y: 1,
      rotationY: Math.PI / 4,
      scale: 1,
      isSolid: true,
    },
    {
      id: "barrel_2",
      type: "barrel",
      x: 3,
      z: 2.3,
      y: 1,
      rotationY: Math.PI / 4,
      scale: 1,
      isSolid: true,
    },
    {
      id: "barrel_3",
      type: "barrel",
      x: 4,
      z: 2.3,
      y: 1,
      rotationY: Math.PI / 4,
      scale: 1,
      isSolid: true,
    },
    {
      id: "flashlight_1",
      type: "flashlight",
      x: 4,
      z: 5.3,
      y: 0.3,
      rotationY: 0,
      scale: 0.3,
      isSolid: true,
      modelRotationY: -1.5,
      // Сразу ДВА источника света у одного фонаря:
      lights: [
        // 1. Мягкий рассеянный свет вокруг самого корпуса лампы
        {
          isSpot: false,
          color: "#93c5fd", // Холодный белый свет
          intensity: 2,
          distance: 0.5,
          offsetY: 0.25,
          offsetX: 0.1,
          offsetZ: 0.3,
        },
        {
          isSpot: true,
          color: "#eff6ff",
          intensity: 35,
          distance: 10,
          angle: Math.PI / 5, //резаный узкий луч
          penumbra: 0.4, // Мягкие края луча
          offsetY: 0.2,
          offsetZ: 0.2, // Смещение из стекла лампы
          targetY: 0,
          targetZ: 2.0, // Луч бьет вперед по оси Z
        },
      ],
    },
    {
      id: "flashlight_2",
      type: "flashlight",
      x: 6,
      z: 11.3,
      y: 1.3,
      rotationY: 1.3,
      scale: 0.3,
      isSolid: true,
      // нужно если модель не совпадает с источником света.
      modelRotationY: -1.5,

      // Сразу ДВА источника света у одного фонаря:
      lights: [
        // 1. Мягкий рассеянный свет вокруг самого корпуса лампы
        {
          isSpot: false,
          color: "#93c5fd", // Холодный белый свет
          intensity: 2,
          distance: 0.5,
          offsetY: 0.25,
          offsetX: 0.1,
          offsetZ: 0.3,
        },
        {
          isSpot: true,
          color: "#eff6ff",
          intensity: 35,
          distance: 10,
          angle: Math.PI / 5, //резаный узкий луч
          penumbra: 0.4, // Мягкие края луча
          offsetY: 0.2,
          offsetZ: 0.2, // Смещение из стекла лампы
          targetY: 0,
          targetZ: 2.0, // Луч бьет вперед по оси Z
        },
      ],
    },
    {
      id: "flashlight_3",
      type: "flashlight",
      x: 4.1,
      z: 2.4,
      y: 2.3,
      rotationY: 5.1,
      scale: 0.3,
      isSolid: true,
      modelRotationY: -1.5,
      // Сразу ДВА источника света у одного фонаря:
      lights: [
        // 1. Мягкий рассеянный свет вокруг самого корпуса лампы
        {
          isSpot: false,
          color: "#93c5fd", // Холодный белый свет
          intensity: 2,
          distance: 0.5,
          offsetY: 0.25,
          offsetX: 0.1,
          offsetZ: 0.3,
        },
        {
          isSpot: true,
          color: "#eff6ff",
          intensity: 35,
          distance: 10,
          angle: Math.PI / 5, //резаный узкий луч
          penumbra: 0.4, // Мягкие края луча
          offsetY: 0.2,
          offsetZ: 0.2, // Смещение из стекла лампы
          targetY: 0,
          targetZ: 2.0, // Луч бьет вперед по оси Z
        },
      ],
    },
    // { id: "prop_2", type: "axe", x: 3.7, z: 1.1, rotationY: -0.5, scale: 0.7 },
    // {
    //   id: "prop_3",
    //   type: "small_rock",
    //   x: 4.0,
    //   z: 3.2,
    //   rotationY: 1.2,
    //   scale: 1.0,
    // },
    // {
    //   id: "prop_4",
    //   type: "small_rock",
    //   x: 4.3,
    //   z: 3.4,
    //   rotationY: 0.2,
    //   scale: 0.6,
    // },
  ],
};
