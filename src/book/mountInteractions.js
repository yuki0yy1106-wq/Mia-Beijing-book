/**
 * 逐页互动（视觉 + 音频反馈）。
 *
 * 热区坐标单位：百分比(0~100)，相对整张 5:3 画面，改数字即可微调位置。
 * 音频由 playAudio() 播放（Mia=晓伊、安安=晓萱），文件放 public/audio/。
 * 调试热区：浏览器地址栏末尾加 `?debug`，可看到热区虚线框。
 */

let overlay = null;
let activeCleanup = null;

// —— 音频播放：统一管理，翻页/切换时中断上一条 ——
let currentAudio = null;

function playAudio(src) {
  if (!src) return;
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    const a = new Audio(src);
    currentAudio = a;
    a.addEventListener("ended", () => {
      if (currentAudio === a) currentAudio = null;
    });
    a.addEventListener("error", () => {
      if (currentAudio === a) currentAudio = null;
    });
    a.play().catch(() => {});
  } catch (_) {}
}

// P7 神兽热区调试：改为 false 时隐藏红框（实际点击不受影响）
const SHOW_HITBOXES = false;

export function clearInteractions() {
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (activeCleanup) {
    activeCleanup.timeouts.forEach((id) => clearTimeout(id));
    activeCleanup = null;
  }
}

export function mountPageInteractions(pageImage, page, actions = {}) {
  clearInteractions();

  const list = page.interactions;
  if (!list || list.length === 0) return;

  const layer = document.createElement("div");
  layer.className = "interaction-layer";

  list.forEach((item) => {
    if (item.type === "find") mountFind(layer, item);
    else if (item.type === "count") mountCount(layer, item);
    else if (item.type === "run") mountRun(layer, item, actions);
    else if (item.type === "choose") mountChoose(layer, item);
    else if (item.type === "advance") mountAdvance(layer, item, actions);
    else if (item.type === "search") mountSearch(layer, item, actions);
    else mountBubble(layer, item);
  });

  pageImage.el.appendChild(layer);
  overlay = layer;
}

function makeHotspot(layer, box) {
  const el = document.createElement("div");
  el.className = "hotspot";
  el.setAttribute("role", "button");
  el.setAttribute("tabindex", "0");
  el.style.left = `${box.x}%`;
  el.style.top = `${box.y}%`;
  el.style.width = `${box.w}%`;
  el.style.height = `${box.h}%`;
  layer.appendChild(el);
  return el;
}

function tap(el, fn) {
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    fn();
  });
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  });
}

function makeHint(layer, text) {
  const el = document.createElement("div");
  el.className = "tap-hint";
  el.textContent = text;
  layer.appendChild(el);
  return el;
}

function setBubble(el, { hanzi, pinyin, ruby }) {
  el.innerHTML = "";
  if (hanzi) {
    const h = document.createElement("span");
    h.className = "pop-hanzi";
    if (ruby && ruby.length) {
      // 逐字注音：按字符位置匹配（支持重复字如"再找找"）
      const chars = hanzi.split("");
      const rubyMap = new Map();
      for (const r of ruby) {
        for (let i = 0; i < chars.length; i++) {
          if (chars[i] === r.char && !rubyMap.has(i)) {
            rubyMap.set(i, r);
            break;
          }
        }
      }
      let result = "";
      for (let i = 0; i < chars.length; i++) {
        if (rubyMap.has(i)) {
          result += `<ruby>${chars[i]}<rt>${rubyMap.get(i).pinyin}</rt></ruby>`;
        } else {
          result += chars[i];
        }
      }
      h.innerHTML = result;
    } else {
      h.textContent = hanzi;
    }
    el.appendChild(h);
  }
  // 整句拼音模式：插入到最前面，使拼音在上、汉字在下
  if (pinyin && !(ruby && ruby.length)) {
    const p = document.createElement("span");
    p.className = "pop-pinyin";
    p.style.textAlign = "center";
    p.textContent = pinyin;
    el.insertBefore(p, el.firstChild);
  }
}

function makeBubble(hot, content) {
  const el = document.createElement("div");
  el.className = "pop-bubble";
  setBubble(el, content);
  hot.appendChild(el);
  return el;
}

function flash(el) {
  el.classList.remove("is-show");
  void el.offsetWidth; // 强制重排，让动画能重复触发
  el.classList.add("is-show");
}

function showCompletion(layer, text = "太棒了！", pinyin) {
  const el = document.createElement("div");
  el.className = "complete-banner";

  const stars = document.createElement("span");
  stars.className = "complete-stars";
  stars.textContent = "⭐⭐⭐";

  const label = document.createElement("span");
  label.className = "complete-label";
  label.textContent = text;

  el.append(stars, label);

  if (pinyin) {
    const py = document.createElement("span");
    py.className = "complete-pinyin";
    py.textContent = pinyin;
    el.appendChild(py);
  }

  layer.appendChild(el);

  setTimeout(() => el.classList.add("is-leaving"), 2600);
  setTimeout(() => el.remove(), 3200);
}

/* P2/P10：点人物/食物 → 气泡（speech=true 时带对话尾巴） */
function mountBubble(layer, item) {
  const hot = makeHotspot(layer, item);
  const bub = makeBubble(hot, item);
  if (item.bubbleDir === "down") {
    bub.style.bottom = "auto";
    bub.style.top = "100%";
  }
  if (item.speech) bub.classList.add("speech");
  let hintEl = item.hint ? makeHint(layer, item.hint) : null;

  tap(hot, () => {
    if (hintEl) {
      hintEl.remove();
      hintEl = null;
    }
    playAudio(item.audio);
    flash(bub);
  });
}

/* P6：找红色 → 点中发光 + 记星星，集齐完成（每个目标自带名称） */
function mountFind(layer, item) {
  const goal = item.goal || item.targets.length;

  const counter = document.createElement("div");
  counter.className = "star-counter";
  layer.appendChild(counter);

  const state = { found: 0 };
  const renderCounter = () => {
    counter.innerHTML = "";
    for (let i = 0; i < goal; i++) {
      const s = document.createElement("span");
      s.className = "star-cell" + (i < state.found ? " is-on" : "");
      s.textContent = "★";
      counter.appendChild(s);
    }
  };
  renderCounter();

  let hintEl = item.hint ? makeHint(layer, item.hint) : null;

  item.targets.forEach((t) => {
    const hot = makeHotspot(layer, t);
    const bub = makeBubble(hot, { hanzi: t.hanzi, pinyin: t.pinyin });
    let done = false;

    tap(hot, () => {
      if (hintEl) {
        hintEl.remove();
        hintEl = null;
      }
      playAudio(t.audio);
      flash(bub);
      hot.classList.add("is-found");
      if (!done) {
        done = true;
        state.found += 1;
        renderCounter();
        if (state.found >= goal) {
          showCompletion(layer, item.doneText);
        }
      }
    });
  });
}

/* P7：点击单只神兽 → 头顶显示数字 + 播放单字语音 */
function mountCount(layer, item) {
  const beasts = item.beasts;
  if (!beasts || beasts.length === 0) return;

  // —— 单一数字气泡：所有神兽共用，只显示当前点击的那一只 ——
  const popup = document.createElement("div");
  popup.className = "beast-popup";
  popup.style.opacity = "0";
  popup.style.pointerEvents = "none";

  const popupHanzi = document.createElement("span");
  popupHanzi.className = "beast-popup-hanzi";
  const popupPinyin = document.createElement("span");
  popupPinyin.className = "beast-popup-pinyin";
  popup.append(popupPinyin, popupHanzi);
  layer.appendChild(popup);

  const showPopup = (beast) => {
    const cx = beast.x + beast.w / 2;
    const topY = beast.y - 1; // 神兽头顶上方（下移约1cm）
    popup.style.left = `${cx}%`;
    popup.style.top = `${topY}%`;
    popupPinyin.textContent = beast.pinyin || "";
    popupHanzi.textContent = beast.hanzi || "";
    popup.classList.remove("is-show");
    void popup.offsetWidth;
    popup.classList.add("is-show");
  };

  let hintEl = item.hint ? makeHint(layer, item.hint) : null;

  beasts.forEach((beast, idx) => {
    const hot = makeHotspot(layer, beast);
    // 标记为神兽热区，用于添加点击反馈
    hot.classList.add("beast-hotspot");

    // 调试可视化：在真实热区位置绘制半透明红色框 + 编号
    if (SHOW_HITBOXES) {
      const dbg = document.createElement("div");
      dbg.className = "beast-debug-box";
      dbg.style.left = `${beast.x}%`;
      dbg.style.top = `${beast.y}%`;
      dbg.style.width = `${beast.w}%`;
      dbg.style.height = `${beast.h}%`;
      dbg.textContent = String(idx + 1);
      layer.appendChild(dbg);
    }

    tap(hot, () => {
      if (hintEl) {
        hintEl.remove();
        hintEl = null;
      }

      // 轻微弹跳反馈
      hot.classList.remove("beast-pop");
      void hot.offsetWidth;
      hot.classList.add("beast-pop");

      // 显示数字在神兽头顶
      showPopup(beast);

      // 播放单字语音
      playAudio(beast.audio);
    });
  });
}

/* P5：奔跑互动 → 静止人物在入口，依次点击4个光点热区，人物跑过去，到出口自动翻页 */
function mountRun(layer, item, actions) {
  const steps = item.steps || [];
  if (steps.length === 0) return;

  const char = item.character || {};
  const startX = char.x != null ? char.x : steps[0].x;
  const startY = char.y != null ? char.y : steps[0].y;

  // —— 人物图层：入口处显示静止人物，跑动时切换为行走人物 ——
  const charEl = document.createElement("div");
  charEl.className = "run-character";
  charEl.style.width = `${char.w || 16}%`;
  charEl.style.left = `${startX}%`;
  charEl.style.top = `${startY}%`;

  const idle = document.createElement("img");
  idle.className = "char-idle";
  idle.src = char.idle || "";
  idle.alt = "";
  idle.draggable = false;

  const walk = document.createElement("img");
  walk.className = "char-walk";
  walk.src = char.walk || "";
  walk.alt = "";
  walk.draggable = false;

  charEl.append(idle, walk);
  layer.appendChild(charEl);

  let hintEl = item.hint ? makeHint(layer, item.hint) : null;
  let reached = 0;
  let busy = false;
  const dots = [];
  const hotspots = [];

  // 只激活「下一个」目标光点
  const setActive = (i) => {
    hotspots.forEach((h, k) => h.classList.toggle("is-active", k === i));
    dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
  };

  steps.forEach((s, i) => {
    const dot = document.createElement("div");
    dot.className = "run-target";
    dot.style.left = `${s.x}%`;
    dot.style.top = `${s.y}%`;
    layer.appendChild(dot);
    dots.push(dot);

    const bw = s.w || 12;
    const bh = s.h || 18;
    const hot = makeHotspot(layer, {
      x: s.x - bw / 2,
      y: s.y - bh / 2,
      w: bw,
      h: bh,
    });
    hot.classList.add("run-hotspot");
    hotspots.push(hot);

    tap(hot, () => {
      if (busy || i !== reached) return;
      busy = true;
      if (hintEl) {
        hintEl.remove();
        hintEl = null;
      }
      setActive(-1);
      dot.classList.add("is-on");

      // 静止 → 行走
      charEl.classList.add("is-running");

      // 等速奔跑：距离越大用时越长
      const fromX = reached === 0 ? startX : steps[reached - 1].x;
      const fromY = reached === 0 ? startY : steps[reached - 1].y;
      const dist = Math.hypot(s.x - fromX, s.y - fromY);
      const ms = Math.max(520, Math.round(dist * 28));

      charEl.style.transitionDuration = `${ms}ms`;
      charEl.style.left = `${s.x}%`;
      charEl.style.top = `${s.y}%`;

      setTimeout(() => {
        // 行走 → 静止
        charEl.classList.remove("is-running");
        reached += 1;
        busy = false;
        if (reached >= steps.length) {
          playAudio(item.doneAudio);
          showCompletion(layer, item.doneText);
          setTimeout(() => actions && actions.next(), item.advanceMs || 1200);
        } else {
          setActive(reached);
        }
      }, ms);
    });
  });

  setActive(0);
}

/* P11：选食物 → 语音 + 气泡 + 食物飞行动画 */
function mountChoose(layer, item) {
  const cleanup = { timeouts: [] };
  let busy = false;

  const miaMouth = item.miaMouth || { x: 30, y: 45 };
  const miaBubblePos = item.miaBubble || { x: 20, y: 28 };

  // —— 预加载食物图片 ——
  item.foods.forEach((f) => {
    const img = new Image();
    img.src = f.img;
  });

  // —— Mia 的「好吃！」气泡 ——
  const miaBubble = document.createElement("div");
  miaBubble.className = "mia-bubble";
  miaBubble.style.left = `${miaBubblePos.x}%`;
  miaBubble.style.top = `${miaBubblePos.y}%`;
  layer.appendChild(miaBubble);

  const showBubble = (el) => el.classList.add("is-visible");
  const hideBubble = (el) => el.classList.remove("is-visible");

  // —— 每个食物各自的「我要…」气泡（独立存在，显示后持续保留） ——
  let hintEl = item.hint ? makeHint(layer, item.hint) : null;

  item.foods.forEach((f) => {
    const hot = makeHotspot(layer, f);

    // 为每个食物创建专属气泡（只创建一次，重复点击复用）
    const foodBubble = document.createElement("div");
    foodBubble.className = "food-bubble";
    layer.appendChild(foodBubble);
    let bubbleShown = false;

    // 悬停微反馈
    hot.addEventListener("mouseenter", () => {
      if (!busy) hot.classList.add("is-hover");
    });
    hot.addEventListener("mouseleave", () => {
      hot.classList.remove("is-hover");
    });

    tap(hot, () => {
      if (busy) return;
      busy = true;

      if (hintEl) {
        hintEl.remove();
        hintEl = null;
      }

      const startX = f.x + f.w / 2;
      const startY = f.y + f.h / 2;

      // 食物气泡位置：默认在食物下方；部分食物太靠下会显示不全，可用 bubbleY 覆盖上移
      const foodBubbleX = startX;
      const foodBubbleY = f.bubbleY != null ? f.bubbleY : f.y + f.h + 4;

      // 1. 播放语音「我要X！」
      const wantHanzi = `我要${f.name}！`;
      const wantPinyin = `wǒ yào ${f.pinyin}`;
      playAudio(f.audio);

      // 2. 在食物附近显示「我要…」气泡（持续保留，不因下次点击其他食物而隐藏）
      if (!bubbleShown) {
        foodBubble.style.left = `${foodBubbleX}%`;
        foodBubble.style.top = `${foodBubbleY}%`;
        setBubble(foodBubble, { hanzi: wantHanzi, pinyin: wantPinyin });
        showBubble(foodBubble);
        bubbleShown = true;
      }

      // 3. 创建食物并播放飞行动画
      const t1 = setTimeout(() => {
        const food = document.createElement("img");
        food.className = "food-fly";
        food.src = f.img;
        food.alt = "";
        food.style.left = `${startX}%`;
        food.style.top = `${startY}%`;
        layer.appendChild(food);

        // 强制 reflow，确保初始样式生效
        food.offsetWidth;

        // 4. 飞向 Mia 嘴边
        const targetX = f.target?.x ?? miaMouth.x;
        const targetY = f.target?.y ?? miaMouth.y;
        requestAnimationFrame(() => {
          food.style.left = `${targetX}%`;
          food.style.top = `${targetY}%`;
        });

        // 5. 到达后缩小淡出
        const flyMs = 1400;
        const t2 = setTimeout(() => {
          food.classList.add("is-eating");

          // 6. 显示 Mia 气泡「好吃！」（食物选择气泡保持显示不自动隐藏）
          const t3 = setTimeout(() => {
            playAudio(item.doneAudio);
            setBubble(miaBubble, { hanzi: "好吃！", pinyin: "hǎochī!" });
            showBubble(miaBubble);

            // 7. 清理：移除食物，稍等后隐藏气泡，解锁
            const t4 = setTimeout(() => {
              food.remove();
              hideBubble(miaBubble);
              busy = false;
            }, 1800);
            cleanup.timeouts.push(t4);
          }, 550);
          cleanup.timeouts.push(t3);
        }, flyMs);
        cleanup.timeouts.push(t2);
      }, 350);
      cleanup.timeouts.push(t1);
    });
  });

  activeCleanup = cleanup;
}

/* P9/P12：点击 → 反馈气泡 → 自动翻页 */
function mountAdvance(layer, item, actions) {
  const hot = makeHotspot(layer, item);

  // 调试可视化：仅当该 item 设置了 debug: true 时显示红框
  if (item.debug) {
    const dbg = document.createElement("div");
    dbg.className = "beast-debug-box";
    dbg.style.left = `${item.x}%`;
    dbg.style.top = `${item.y}%`;
    dbg.style.width = `${item.w}%`;
    dbg.style.height = `${item.h}%`;
    layer.appendChild(dbg);
  }

  const bub = item.hanzi ? makeBubble(hot, item) : null;
  let hintEl = item.hint ? makeHint(layer, item.hint) : null;
  let done = false;

  tap(hot, () => {
    if (done) return;
    done = true;
    if (hintEl) {
      hintEl.remove();
      hintEl = null;
    }
    if (bub) flash(bub);
    playAudio(item.audio);
    hot.classList.add("is-found");
    setTimeout(() => actions && actions.next(), item.advanceMs || 900);
  });
}

/* P15：找小Kiwi → 三个"疑似"温和反馈 + 真身庆祝并翻页 */
function mountSearch(layer, item, actions) {
  let hintEl = item.hint ? makeHint(layer, item.hint) : null;
  let found = false;

  item.decoys.forEach((d, i) => {
    const hot = makeHotspot(layer, d);
    const bub = makeBubble(hot, { hanzi: d.hanzi, pinyin: d.pinyin, ruby: d.ruby });

    // 右下角小鸟转身动画：3.0x 热区；位置向左 12px、向上 8px，覆盖背景小鸟
    let birdEl = null;
    if (i === 2) {
      birdEl = document.createElement("div");
      birdEl.className = "bird-turn";
      const scale = 2.0 * 1.5;          // 3.0 倍热区（保持不变）
      const SHIFT_X = 1.5;              // 向左微调 4px ≈ 0.5%
      const SHIFT_Y = -0.5;               // 向上微调 3px ≈ 0.5%
      const cx = d.x + d.w / 2 + SHIFT_X;
      const cy = d.y + d.h / 2 + SHIFT_Y;
      const bw = d.w * scale;
      const bh = d.h * scale;
      birdEl.style.left = `${cx - bw / 2}%`;
      birdEl.style.top = `${cy - bh / 2}%`;
      birdEl.style.width = `${bw}%`;
      birdEl.style.height = `${bh}%`;
      birdEl.innerHTML = `<img src="./public/images/p12bird.PNG" alt="bird">`;
      layer.appendChild(birdEl);
    }

    tap(hot, () => {
      if (found) return;
      if (hintEl) {
        hintEl.remove();
        hintEl = null;
      }
      playAudio(d.audio);
      flash(bub);
      // 触发生鸡动画
      if (birdEl) {
        birdEl.classList.remove("is-turned");
        void birdEl.offsetWidth;
        birdEl.classList.add("is-turned");
      }
      hot.classList.remove("is-miss");
      void hot.offsetWidth;
      hot.classList.add("is-miss");
    });
  });

  const targetHot = makeHotspot(layer, item.target);
  const targetBub = makeBubble(targetHot, { hanzi: item.target.hanzi, pinyin: item.target.pinyin, ruby: item.target.ruby });

  tap(targetHot, () => {
    if (found) return;
    found = true;
    if (hintEl) {
      hintEl.remove();
      hintEl = null;
    }
    playAudio(item.target.audio);
    flash(targetBub);
    targetHot.classList.add("is-found");
    showCompletion(layer, item.doneText, item.donePinyin);
    setTimeout(() => actions && actions.next(), 1800);
  });
}
