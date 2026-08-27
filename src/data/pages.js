/**
 * Page registry. Each entry is one full-page illustration.
 * `interactions` 是每页的互动配置（纯视觉，无音频）。
 * 坐标单位：百分比(0~100)，相对整张 5:3 画面。
 */
const IMAGE_DIR = "./public/images";

export const COVER_PAGE = {
  id: "cover",
  src: `${IMAGE_DIR}/cover.png`,
  kind: "cover",
  interactions: [],
};

export const STORY_PAGES = [
  { id: "p1", src: `${IMAGE_DIR}/p1.png`, kind: "story", interactions: [] },
  {
    id: "p2",
    src: `${IMAGE_DIR}/p2.png`,
    kind: "story",
    interactions: [
      // 点两个人物 → 说「你好」（speech=true 带对话气泡尾巴）
      { type: "bubble", speech: true, x: 20, y: 40, w: 24, h: 42, hanzi: "你好", pinyin: "Nǐ hǎo", hint: "👆 点一点，打招呼" },
      { type: "bubble", speech: true, x: 48, y: 40, w: 24, h: 42, hanzi: "你好", pinyin: "Nǐ hǎo" },
    ],
  },
  { id: "p3", src: `${IMAGE_DIR}/p3.jpg`, kind: "story", interactions: [] },
  { id: "p4", src: `${IMAGE_DIR}/p4.jpg`, kind: "story", interactions: [] },
  {
    id: "p5",
    src: `${IMAGE_DIR}/p5.jpg`,
    kind: "story",
    interactions: [
      {
        // 走迷宫：静止人物→行走人物，跟着脚印从入口走到出口自动翻页
        type: "maze",
        hint: "👆 沿着脚印走迷宫",
        doneText: "走到出口啦！",
        advanceMs: 1200,
        threshold: 9,
        waypoints: [
          { x: 14, y: 86 }, // 左下入口
          { x: 24, y: 74 },
          { x: 34, y: 62 },
          { x: 30, y: 50 },
          { x: 44, y: 44 },
          { x: 52, y: 34 },
          { x: 64, y: 27 },
          { x: 76, y: 18 }, // 右上红门出口
        ],
      },
    ],
  },
  {
    id: "p6",
    src: `${IMAGE_DIR}/p6.png`,
    kind: "story",
    interactions: [
      {
        type: "find",
        goal: 3,
        hint: "👆 找一找红色",
        doneText: "太棒了！",
        targets: [
          { x: 0, y: 22, w: 20, h: 50, hanzi: "红色的门", pinyin: "Hóng sè de mén" },
          { x: 24, y: 38, w: 31, h: 38, hanzi: "红色的墙", pinyin: "Hóng sè de qiáng" },
          { x: 58, y: 35, w: 26, h: 34, hanzi: "红色的柱子", pinyin: "Hóng sè de zhù zi" },
        ],
      },
    ],
  },
  {
    id: "p7",
    src: `${IMAGE_DIR}/p7.jpg`,
    kind: "story",
    interactions: [
      {
        type: "count",
        x: 0, y: 0, w: 100, h: 55,
        count: 10,
        stepMs: 900,
        hint: "👆 点一点，数一数",
        doneText: "数完啦！",
      },
    ],
  },
  { id: "p8", src: `${IMAGE_DIR}/p8.jpg`, kind: "story", interactions: [] },
  {
    id: "p9",
    src: `${IMAGE_DIR}/p9.jpg`,
    kind: "story",
    interactions: [
      // 点黄色毛线 → 进店 → 自动翻到 P10
      { type: "advance", x: 57, y: 66, w: 14, h: 20, hanzi: "看！", pinyin: "Kàn", hint: "👆 点一点黄色毛线", advanceMs: 900 },
    ],
  },
  {
    id: "p10",
    src: `${IMAGE_DIR}/p10.jpg`,
    kind: "story",
    interactions: [],
  },
  {
    id: "p11",
    src: `${IMAGE_DIR}/p11.jpg`,
    kind: "story",
    interactions: [],
  },
  {
    id: "p12",
    src: `${IMAGE_DIR}/p12.jpg`,
    kind: "story",
    interactions: [
      // 点窗外Kiwi → 追 → 自动翻到 P13
      { type: "advance", x: 21, y: 26, w: 14, h: 18, hanzi: "小Kiwi！", pinyin: "Xiǎo Kiwi!", hint: "👆 点一点窗外", advanceMs: 900 },
    ],
  },
  { id: "p13", src: `${IMAGE_DIR}/p13.jpg`, kind: "story", interactions: [] },
  { id: "p14", src: `${IMAGE_DIR}/p14.jpg`, kind: "story", interactions: [] },
  {
    id: "p15",
    src: `${IMAGE_DIR}/p15.jpg`,
    kind: "story",
    interactions: [
      {
        // 找小Kiwi：三个"疑似"温和反馈 + 真身庆祝并翻到 P16
        type: "search",
        hint: "👆 找一找小Kiwi",
        doneText: "找到你啦！",
        donePinyin: "Zhǎo dào nǐ la",
        decoys: [
          { x: 4, y: 76, w: 16, h: 20, hanzi: "不是……", pinyin: "Bù shì" },
          { x: 37, y: 61, w: 16, h: 20, hanzi: "也不是！", pinyin: "Yě bù shì" },
          { x: 78, y: 76, w: 16, h: 20, hanzi: "再找找！", pinyin: "Zài zhǎo zhao" },
        ],
        target: { x: 68, y: 24, w: 16, h: 20, hanzi: "找到了！", pinyin: "Zhǎo dào le" },
      },
    ],
  },
  { id: "p16", src: `${IMAGE_DIR}/p16.jpg`, kind: "story", interactions: [] },
  { id: "p17", src: `${IMAGE_DIR}/p17.jpg`, kind: "story", interactions: [] },
  { id: "p18", src: `${IMAGE_DIR}/p18.jpg`, kind: "story", interactions: [] },
  { id: "p19", src: `${IMAGE_DIR}/p19.jpg`, kind: "story", interactions: [] },
];

export const LAST_PAGE_INDEX = STORY_PAGES.length - 1;
