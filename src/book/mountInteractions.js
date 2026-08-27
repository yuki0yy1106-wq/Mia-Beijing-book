/**
 * 逐页互动（纯视觉反馈，无音频）。
 *
 * 热区坐标单位：百分比(0~100)，相对整张 5:3 画面，改数字即可微调位置。
 * 想加声音：在 tap 回调里补一句播放即可，音频放 public/audio/。
 * 调试热区：浏览器地址栏末尾加 `?debug`，可看到热区虚线框。
 */

const CHINESE_NUMBERS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
const CHINESE_NUMBER_PINYIN = ["yī", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ", "shí"];

let overlay = null;

export function clearInteractions() {
  if (overlay) {
    overlay.remove();
    overlay = null;
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
    else if (item.type === "maze") mountMaze(layer, item, actions);
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

function setBubble(el, { hanzi, pinyin }) {
  el.innerHTML = "";
  if (hanzi) {
    const h = document.createElement("span");
    h.className = "pop-hanzi";
    h.textContent = hanzi;
    el.appendChild(h);
  }
  if (pinyin) {
    const p = document.createElement("span");
    p.className = "pop-pinyin";
    p.textContent = pinyin;
    el.appendChild(p);
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
  if (item.speech) bub.classList.add("speech");
  let hintEl = item.hint ? makeHint(layer, item.hint) : null;

  tap(hot, () => {
    if (hintEl) {
      hintEl.remove();
      hintEl = null;
    }
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
      flash(bub);
      hot.classList.add("is-found");
      if (!done) {
        done = true;
        state.found += 1;
        renderCounter();
        if (state.found >= goal) showCompletion(layer, item.doneText);
      }
    });
  });
}

/* P7：点屋脊 → 数字 1~10 依次亮起（带底色 + 拼音） */
function mountCount(layer, item) {
  const hot = makeHotspot(layer, item);

  const num = document.createElement("div");
  num.className = "count-number";
  const numHanzi = document.createElement("span");
  numHanzi.className = "count-hanzi";
  const numPinyin = document.createElement("span");
  numPinyin.className = "count-pinyin";
  num.append(numHanzi, numPinyin);
  layer.appendChild(num);

  const dots = document.createElement("div");
  dots.className = "count-dots";
  for (let i = 0; i < item.count; i++) {
    const d = document.createElement("span");
    d.className = "count-dot";
    dots.appendChild(d);
  }
  layer.appendChild(dots);

  let hintEl = item.hint ? makeHint(layer, item.hint) : null;
  let running = false;

  const run = () => {
    if (running) return;
    running = true;
    if (hintEl) {
      hintEl.remove();
      hintEl = null;
    }
    Array.from(dots.children).forEach((d) => d.classList.remove("is-on"));

    let i = 0;
    const tick = () => {
      if (i >= item.count) {
        numHanzi.textContent = "";
        numPinyin.textContent = "";
        running = false;
        showCompletion(layer, item.doneText);
        return;
      }
      const word = item.words ? item.words[i] : CHINESE_NUMBERS[i] || String(i + 1);
      const py = item.pinyin ? item.pinyin[i] : CHINESE_NUMBER_PINYIN[i] || "";
      numHanzi.textContent = word;
      numPinyin.textContent = py;
      flash(num);
      dots.children[i].classList.add("is-on");
      i += 1;
      setTimeout(tick, item.stepMs || 650);
    };
    tick();
  };

  tap(hot, run);
}

/* P5：走迷宫 → 人物(静止→行走)跟着脚印走，手指沿路径划过各节点，到出口自动翻页 */
function mountMaze(layer, item, actions) {
  const track = document.createElement("div");
  track.className = "maze-track";

  item.waypoints.forEach((wp) => {
    const dot = document.createElement("div");
    dot.className = "maze-point";
    dot.style.left = `${wp.x}%`;
    dot.style.top = `${wp.y}%`;
    track.appendChild(dot);
  });

  layer.appendChild(track);

  // 人物图层：左下角显示静止人物；开始互动后丝滑切换为行走人物并跟着脚印移动
  let charEl = null;
  if (item.character) {
    const start = item.waypoints[0] || { x: 0, y: 0 };
    charEl = document.createElement("div");
    charEl.className = "maze-character";

    const idle = document.createElement("img");
    idle.className = "char-idle";
    idle.src = item.character.idle;
    idle.alt = "";
    idle.draggable = false;

    const walk = document.createElement("img");
    walk.className = "char-walk";
    walk.src = item.character.walk;
    walk.alt = "";
    walk.draggable = false;

    charEl.append(idle, walk);
    charEl.style.width = `${item.character.w || 12}%`;
    charEl.style.left = `${item.character.x != null ? item.character.x : start.x}%`;
    charEl.style.top = `${item.character.y != null ? item.character.y : start.y}%`;
    layer.appendChild(charEl);
  }

  let hintEl = item.hint ? makeHint(layer, item.hint) : null;
  let idx = 0;
  let done = false;
  const threshold = item.threshold || 9;

  const moveChar = (x, y) => {
    if (!charEl) return;
    charEl.style.left = `${x}%`;
    charEl.style.top = `${y}%`;
  };

  const hit = (px, py) => {
    if (done || idx >= item.waypoints.length) return;
    const wp = item.waypoints[idx];
    const dx = px - wp.x;
    const dy = py - wp.y;
    if (dx * dx + dy * dy <= threshold * threshold) {
      track.children[idx].classList.add("is-on");
      moveChar(wp.x, wp.y);
      idx += 1;
      if (idx >= item.waypoints.length) {
        done = true;
        if (hintEl) {
          hintEl.remove();
          hintEl = null;
        }
        showCompletion(layer, item.doneText);
        setTimeout(() => actions && actions.next(), item.advanceMs || 1200);
      }
    }
  };

  const toPercent = (e) => {
    const rect = track.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    return { px, py };
  };

  let dragging = false;
  track.addEventListener("pointerdown", (e) => {
    dragging = true;
    if (track.setPointerCapture) track.setPointerCapture(e.pointerId);
    if (hintEl) {
      hintEl.remove();
      hintEl = null;
    }
    if (charEl) charEl.classList.add("is-walking");
    const { px, py } = toPercent(e);
    hit(px, py);
  });
  track.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const { px, py } = toPercent(e);
    hit(px, py);
  });
  const stop = () => {
    dragging = false;
  };
  track.addEventListener("pointerup", stop);
  track.addEventListener("pointercancel", stop);
}

/* P11：选食物 → 「我要X！」→ 换成「好吃！」 */
function mountChoose(layer, item) {
  let hintEl = item.hint ? makeHint(layer, item.hint) : null;

  item.foods.forEach((f) => {
    const hot = makeHotspot(layer, f);
    const bub = makeBubble(hot, { hanzi: `我要${f.name}！`, pinyin: `Wǒ yào ${f.pinyin}` });
    let done = false;

    tap(hot, () => {
      if (done) return;
      done = true;
      if (hintEl) {
        hintEl.remove();
        hintEl = null;
      }
      flash(bub);
      hot.classList.add("is-found");
      setTimeout(() => {
        setBubble(bub, { hanzi: "好吃！", pinyin: "Hǎo chī" });
        flash(bub);
      }, 900);
    });
  });
}

/* P9/P12：点击 → 反馈气泡 → 自动翻页 */
function mountAdvance(layer, item, actions) {
  const hot = makeHotspot(layer, item);
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
    hot.classList.add("is-found");
    setTimeout(() => actions && actions.next(), item.advanceMs || 900);
  });
}

/* P15：找小Kiwi → 三个"疑似"温和反馈 + 真身庆祝并翻页 */
function mountSearch(layer, item, actions) {
  let hintEl = item.hint ? makeHint(layer, item.hint) : null;
  let found = false;

  item.decoys.forEach((d) => {
    const hot = makeHotspot(layer, d);
    const bub = makeBubble(hot, { hanzi: d.hanzi, pinyin: d.pinyin });

    tap(hot, () => {
      if (found) return;
      if (hintEl) {
        hintEl.remove();
        hintEl = null;
      }
      flash(bub);
      hot.classList.remove("is-miss");
      void hot.offsetWidth;
      hot.classList.add("is-miss");
    });
  });

  const targetHot = makeHotspot(layer, item.target);
  const targetBub = makeBubble(targetHot, { hanzi: item.target.hanzi, pinyin: item.target.pinyin });

  tap(targetHot, () => {
    if (found) return;
    found = true;
    if (hintEl) {
      hintEl.remove();
      hintEl = null;
    }
    flash(targetBub);
    targetHot.classList.add("is-found");
    showCompletion(layer, item.doneText, item.donePinyin);
    setTimeout(() => actions && actions.next(), 1800);
  });
}
