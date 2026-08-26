export function createNavControls({ onPrev, onNext, onStart }) {
  const prevBtn = document.createElement("button");
  prevBtn.type = "button";
  prevBtn.className = "page-arrow page-arrow-prev is-hidden";
  prevBtn.setAttribute("aria-label", "上一页");
  prevBtn.textContent = "‹";
  prevBtn.addEventListener("click", onPrev);

  const nextBtn = document.createElement("button");
  nextBtn.type = "button";
  nextBtn.className = "page-arrow page-arrow-next is-hidden";
  nextBtn.setAttribute("aria-label", "下一页");
  nextBtn.textContent = "›";
  nextBtn.addEventListener("click", onNext);

  const startBtn = document.createElement("button");
  startBtn.type = "button";
  startBtn.className = "start-bubble";
  startBtn.textContent = "开始阅读";
  startBtn.addEventListener("click", onStart);

  function render(state) {
    const showStart = state.isCover;
    startBtn.style.display = showStart ? "flex" : "none";
    prevBtn.classList.toggle("is-hidden", state.isCover || state.isFirstPage);
    nextBtn.classList.toggle("is-hidden", state.isCover || state.isLastPage);
  }

  return { prevBtn, nextBtn, startBtn, render };
}
