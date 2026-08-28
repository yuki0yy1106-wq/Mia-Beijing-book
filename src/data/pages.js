/**
 * Page registry. Each entry is one full-page illustration.
 * `interactions` 是每页的互动配置（纯视觉，无音频）。
 * 坐标单位：百分比(0~100)，相对整张 5:3 画面。
 */
const IMAGE_DIR = "./public/images";
const AUDIO_DIR = "./public/audio";

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
      { type: "bubble", speech: true, x: 20, y: 40, w: 24, h: 42, hanzi: "你好", pinyin: "Nǐ hǎo", audio: `${AUDIO_DIR}/mia-p2-hello.mp3`, hint: "👆 点一点，打招呼" },
      { type: "bubble", speech: true, x: 48, y: 40, w: 24, h: 42, hanzi: "你好", pinyin: "Nǐ hǎo", audio: `${AUDIO_DIR}/anan-p2-hello.mp3` },
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
        doneAudio: `${AUDIO_DIR}/mia-p5-done.mp3`,
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
          { x: 0, y: 22, w: 20, h: 50, hanzi: "红色的门", pinyin: "Hóngsè de mén", audio: `${AUDIO_DIR}/mia-p6-men.mp3` },
          { x: 24, y: 38, w: 31, h: 38, hanzi: "红色的墙", pinyin: "Hóngsè de qiáng", audio: `${AUDIO_DIR}/mia-p6-qiang.mp3` },
          { x: 58, y: 35, w: 26, h: 34, hanzi: "红色的柱子", pinyin: "Hóngsè de zhùzi", audio: `${AUDIO_DIR}/mia-p6-zhuzi.mp3` },
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
        hint: "👆 点一点，数一数",
        beasts: [
          { x: 35, y: 16, w: 10, h: 22, hanzi: "一", pinyin: "yī", audio: `${AUDIO_DIR}/mia-p7-1.mp3` },
          { x: 45, y: 17, w: 5, h: 21, hanzi: "二", pinyin: "èr", audio: `${AUDIO_DIR}/mia-p7-2.mp3` },
          { x: 52, y: 17, w: 6, h: 21, hanzi: "三", pinyin: "sān", audio: `${AUDIO_DIR}/mia-p7-3.mp3` },
          { x: 58, y: 17, w: 6, h: 21, hanzi: "四", pinyin: "sì", audio: `${AUDIO_DIR}/mia-p7-4.mp3` },
          { x: 64, y: 17, w: 5, h: 21, hanzi: "五", pinyin: "wǔ", audio: `${AUDIO_DIR}/mia-p7-5.mp3` },
          { x: 69, y: 17, w: 5, h: 21, hanzi: "六", pinyin: "liù", audio: `${AUDIO_DIR}/mia-p7-6.mp3` },
          { x: 75, y: 17, w: 5, h: 21, hanzi: "七", pinyin: "qī", audio: `${AUDIO_DIR}/mia-p7-7.mp3` },
          { x: 80, y: 17, w: 6, h: 22, hanzi: "八", pinyin: "bā", audio: `${AUDIO_DIR}/mia-p7-8.mp3` },
          { x: 86, y: 17, w: 6, h: 22, hanzi: "九", pinyin: "jiǔ", audio: `${AUDIO_DIR}/mia-p7-9.mp3` },
          { x: 92, y: 18, w: 7, h: 22, hanzi: "十", pinyin: "shí", audio: `${AUDIO_DIR}/mia-p7-10.mp3` },
        ],
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
      { type: "advance", x: 57, y: 66, w: 14, h: 20, hanzi: "看！", pinyin: "Kàn", audio: `${AUDIO_DIR}/anan-p9-kan.mp3`, hint: "👆 点一点黄色毛线", advanceMs: 900 },
    ],
  },
  {
    id: "p10",
    src: `${IMAGE_DIR}/p10.jpg`,
    kind: "story",
    interactions: [
      // 点三种食物 → 说出名字
      { type: "bubble", x: 12, y: 62, w: 20, h: 24, hanzi: "这是包子", pinyin: "Zhè shì bāozi", audio: `${AUDIO_DIR}/anan-p10-baozi.mp3`, hint: "👆 点一点食物" },
      { type: "bubble", x: 38, y: 55, w: 20, h: 24, hanzi: "这是面条", pinyin: "Zhè shì miàntiáo", audio: `${AUDIO_DIR}/anan-p10-miantiao.mp3` },
      { type: "bubble", x: 68, y: 58, w: 20, h: 24, hanzi: "这是糖葫芦", pinyin: "Zhè shì tánghúlu", audio: `${AUDIO_DIR}/anan-p10-tanghulu.mp3` },
    ],
  },
  {
    id: "p11",
    src: `${IMAGE_DIR}/p11.jpg`,
    kind: "story",
    interactions: [
      {
        type: "choose",
        hint: "👆 选一种好吃的",
        miaMouth: { x: 37, y: 50 },
        miaBubble: { x: 14, y: 26 },
        doneAudio: `${AUDIO_DIR}/mia-p11-haochi.mp3`,
        foods: [
          {
            x: 12, y: 68, w: 22, h: 20,
            name: "包子",
            pinyin: "bāozi",
            img: "./public/images/food/baozi.png",
            audio: `${AUDIO_DIR}/mia-p11-baozi.mp3`,
          },
          {
            x: 36, y: 66, w: 28, h: 24,
            name: "面条",
            pinyin: "miàntiáo",
            img: "./public/images/food/noodles.png",
            audio: `${AUDIO_DIR}/mia-p11-miantiao.mp3`,
            bubbleY: 89, // 面条气泡太靠下会显示不全，上移约1cm
          },
          {
            x: 62, y: 68, w: 28, h: 20,
            name: "糖葫芦",
            pinyin: "tánghúlu",
            img: "./public/images/food/tanghulu.png",
            audio: `${AUDIO_DIR}/mia-p11-tanghulu.mp3`,
            target: { x: 43, y: 55 },
          },
        ],
      },
    ],
  },
  {
    id: "p12",
    src: `${IMAGE_DIR}/p12.jpg`,
    kind: "story",
    interactions: [
      // 点窗外Kiwi → 追 → 自动翻到 P13
      { type: "advance", x: 16, y: 36, w: 7, h: 9, hanzi: "小Kiwi！", ruby: [{ char: "小", pinyin: "xiǎo" }], audio: `${AUDIO_DIR}/mia-p12-kiwi.mp3`, hint: "👆 点一点小Kiwi", advanceMs: 900 },
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
        donePinyin: "Zhǎodào nǐ la",
        decoys: [
          { x: 4, y: 76, w: 16, h: 20, hanzi: "不是", pinyin: "bú shì", audio: `${AUDIO_DIR}/mia-p15-bushi.mp3` },
          { x: 37, y: 49, w: 16, h: 20, hanzi: "不是", pinyin: "bú shì", audio: `${AUDIO_DIR}/mia-p15-bushi.mp3` },
          { x: 78, y: 76, w: 16, h: 20, hanzi: "再找找！", pinyin: "zài zhǎo zhao", audio: `${AUDIO_DIR}/mia-p15-zaizhaozhao.mp3` },
        ],
        target: { x: 68, y: 35, w: 16, h: 20, hanzi: "找到了！", pinyin: "Zhǎodào le", audio: `${AUDIO_DIR}/mia-p15-zhaodaole.mp3` },
      },
    ],
  },
  { id: "p16", src: `${IMAGE_DIR}/p16.jpg`, kind: "story", interactions: [] },
  { id: "p17", src: `${IMAGE_DIR}/p17.jpg`, kind: "story", interactions: [] },
  { id: "p18", src: `${IMAGE_DIR}/p18.jpg`, kind: "story", interactions: [] },
  { id: "p19", src: `${IMAGE_DIR}/p19.jpg`, kind: "story", interactions: [] },
];

export const LAST_PAGE_INDEX = STORY_PAGES.length - 1;
