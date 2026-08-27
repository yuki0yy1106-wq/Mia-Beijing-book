const FLIP_MS = 1000;
const SLIDE_MS = 700;

export function createPageImage() {
  const stage = document.createElement("div");
  stage.className = "page-stage";

  const base = createLayer("page-base");
  const groundShadow = document.createElement("div");
  groundShadow.className = "ground-shadow";
  base.el.appendChild(groundShadow);

  const flip = createFlipLayer();
  flip.el.setAttribute("aria-hidden", "true");
  stage.append(base.el, flip.el);

  let currentSrc = "";
  let requestId = 0;

  async function show(src, direction = "none", transition = "flip") {
    if (src === currentSrc) return;
    const id = ++requestId;
    const outgoingSrc = currentSrc;
    currentSrc = src;

    await loadImage(base.img, src);
    if (id !== requestId) return;

    const shouldAnimate =
      (direction === "next" || direction === "prev") && outgoingSrc;

    if (!shouldAnimate) {
      resetFlipElement(flip.el);
      resetGroundShadow(groundShadow);
      return;
    }

    await Promise.all([
      loadImage(flip.img, outgoingSrc),
      loadImage(flip.backImg, src),
    ]);
    if (id !== requestId) return;

    if (transition === "slide") {
      await animateSlide(flip.el, direction);
    } else {
      await animateFlip(flip.el, groundShadow, direction);
    }
    if (id !== requestId) return;
    resetFlipElement(flip.el);
    resetGroundShadow(groundShadow);
  }

  return { el: stage, show };
}

function createLayer(extraClass) {
  const el = document.createElement("div");
  el.className = `page-layer ${extraClass}`;

  const img = document.createElement("img");
  img.className = "page-image";
  img.alt = "";
  img.draggable = false;
  el.appendChild(img);

  return { el, img };
}

function createFlipLayer() {
  const el = document.createElement("div");
  el.className = "page-layer page-flip";

  const front = document.createElement("div");
  front.className = "page-flip-face page-flip-front";

  const img = document.createElement("img");
  img.className = "page-image";
  img.alt = "";
  img.draggable = false;
  front.appendChild(img);

  const frontShade = document.createElement("div");
  frontShade.className = "page-shade";
  front.appendChild(frontShade);

  const frontCrease = document.createElement("div");
  frontCrease.className = "page-crease";
  front.appendChild(frontCrease);

  const back = document.createElement("div");
  back.className = "page-flip-face page-flip-back";

  const backImg = document.createElement("img");
  backImg.className = "page-image";
  backImg.alt = "";
  backImg.draggable = false;
  back.appendChild(backImg);

  const backShade = document.createElement("div");
  backShade.className = "page-shade";
  back.appendChild(backShade);

  const backCrease = document.createElement("div");
  backCrease.className = "page-crease";
  back.appendChild(backCrease);

  el.appendChild(front);
  el.appendChild(back);

  return { el, img, backImg };
}

function resetFlipElement(el) {
  el.style.transform = "";
  el.style.boxShadow = "";
  el.style.filter = "";
  el.style.transformOrigin = "";
  el.style.clipPath = "";
  el.style.webkitClipPath = "";
  el.style.zIndex = "";
  el.classList.remove(
    "is-flipping",
    "flip-next",
    "flip-prev",
    "is-sliding",
    "slide-next",
    "slide-prev"
  );

  const front = el.querySelector(".page-flip-front");
  const back = el.querySelector(".page-flip-back");
  if (front) {
    front.style.transform = "";
    front.style.clipPath = "";
    front.style.webkitClipPath = "";
    const frontCrease = front.querySelector(".page-crease");
    if (frontCrease) {
      frontCrease.style.left = "";
      frontCrease.style.right = "";
    }
  }
  if (back) {
    back.style.transform = "";
    back.style.clipPath = "";
    back.style.webkitClipPath = "";
    const backCrease = back.querySelector(".page-crease");
    if (backCrease) {
      backCrease.style.left = "";
      backCrease.style.right = "";
    }
  }
}

function resetGroundShadow(el) {
  el.style.opacity = "0";
  el.style.transform = "";
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateFlip(flipEl, groundShadow, direction) {
  return new Promise((resolve) => {
    const duration = FLIP_MS;
    const start = performance.now();

    const spine = direction === "next" ? "left" : "right";
    const dirSign = direction === "next" ? -1 : 1;
    const front = flipEl.querySelector(".page-flip-front");
    const back = flipEl.querySelector(".page-flip-back");
    const frontCrease = front.querySelector(".page-crease");
    const backCrease = back.querySelector(".page-crease");

    flipEl.classList.add("is-flipping", `flip-${direction}`);
    flipEl.style.transformOrigin = `${spine} center`;
    flipEl.style.transition = "none";

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const e = easeInOutCubic(t);

      const bendT = Math.sin(t * Math.PI);

      const baseAngle = dirSign * 175 * e;

      flipEl.style.transform = `rotateY(${baseAngle}deg)`;

      const foldDepth = bendT * 32;
      if (direction === "next") {
        front.style.clipPath = `inset(0 ${foldDepth}% 0 0)`;
        front.style.webkitClipPath = `inset(0 ${foldDepth}% 0 0)`;
        back.style.clipPath = `inset(0 0 0 ${foldDepth}%)`;
        back.style.webkitClipPath = `inset(0 0 0 ${foldDepth}%)`;
        if (frontCrease) frontCrease.style.right = `${foldDepth}%`;
        if (backCrease) backCrease.style.left = `${foldDepth}%`;
      } else {
        front.style.clipPath = `inset(0 0 0 ${foldDepth}%)`;
        front.style.webkitClipPath = `inset(0 0 0 ${foldDepth}%)`;
        back.style.clipPath = `inset(0 ${foldDepth}% 0 0)`;
        back.style.webkitClipPath = `inset(0 ${foldDepth}% 0 0)`;
        if (frontCrease) frontCrease.style.left = `${foldDepth}%`;
        if (backCrease) backCrease.style.right = `${foldDepth}%`;
      }

      const shadowBlur = 4 + bendT * 30;
      const shadowDist = 2 + bendT * 10;
      const shadowAlpha = 0.02 + bendT * 0.22;
      const shadowSide = direction === "next" ? -1 : 1;
      flipEl.style.boxShadow =
        `${shadowSide * shadowDist}px ${6 + bendT * 6}px ${shadowBlur}px rgba(30, 22, 14, ${shadowAlpha})`;

      const brightness = 1 - bendT * 0.26;
      flipEl.style.filter = `brightness(${brightness})`;

      flipEl.style.zIndex = String(10 + Math.round(bendT * 5));

      groundShadow.style.opacity = String(bendT * 0.30);
      const gsScale = 0.7 + bendT * 0.35;
      groundShadow.style.transform = `scale(${gsScale})`;

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

function animateSlide(flipEl, direction) {
  return new Promise((resolve) => {
    const duration = SLIDE_MS;
    const start = performance.now();
    const dir = direction === "next" ? 1 : -1;
    const front = flipEl.querySelector(".page-flip-front");
    const back = flipEl.querySelector(".page-flip-back");

    flipEl.classList.add("is-sliding", `slide-${direction}`);
    flipEl.style.transition = "none";
    // 初始位置：旧图居中，新图在右（next）或左（prev）待命
    front.style.transform = "translateX(0%)";
    back.style.transform = `translateX(${dir * 100}%)`;

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const e = easeInOutCubic(t);
      front.style.transform = `translateX(${dir * -100 * e}%)`;
      back.style.transform = `translateX(${dir * (100 - 100 * e)}%)`;
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(frame);
  });
}

function loadImage(img, src) {
  return new Promise((resolve) => {
    if (img.getAttribute("src") === src && img.complete && img.naturalWidth) {
      resolve();
      return;
    }
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}
