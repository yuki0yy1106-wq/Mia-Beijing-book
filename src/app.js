import { createBookController } from "./book/createBookController.js";
import { bindKeyboard } from "./book/bindKeyboard.js";
import { createPageImage } from "./components/pageImage.js";
import { createNavControls } from "./components/navControls.js";
import { renderCover } from "./views/coverView.js";
import { renderReaderPage } from "./views/readerView.js";

export function mountApp(root) {
  const controller = createBookController();
  const pageImage = createPageImage();
  let turning = false;

  const go = (action) => {
    if (turning) return;
    action();
  };

  const nav = createNavControls({
    onStart: () => go(() => controller.startReading()),
    onPrev: () => go(() => controller.prev()),
    onNext: () => go(() => controller.next()),
  });

  const spread = document.createElement("div");
  spread.className = "book-spread";
  spread.append(pageImage.el);
  pageImage.el.append(nav.prevBtn, nav.nextBtn, nav.startBtn);

  const shell = document.createElement("main");
  shell.className = "book-shell";
  shell.append(spread);
  root.replaceChildren(shell);

  let lastScreen = "cover";
  let lastPageIndex = 0;

  async function paint(state) {
    const direction = resolveDirection(state, lastScreen, lastPageIndex);
    lastScreen = state.screen;
    lastPageIndex = state.pageIndex;

    shell.dataset.screen = state.screen;
    shell.dataset.pageIndex = String(state.pageIndex);
    nav.render(state);

    turning = direction !== "none";
    if (state.isCover) {
      await renderCover(pageImage, direction);
    } else {
      await renderReaderPage(pageImage, state.pageIndex, direction);
    }
    turning = false;
  }

  controller.subscribe(paint);
  paint(controller.getState());
  bindKeyboard(controller, () => turning);

  return controller;
}

function resolveDirection(state, lastScreen, lastPageIndex) {
  if (state.screen === lastScreen && state.pageIndex === lastPageIndex) {
    return "none";
  }
  if (lastScreen === "cover" && state.screen === "reading") return "next";
  if (lastScreen === "reading" && state.screen === "cover") return "prev";
  if (state.pageIndex > lastPageIndex) return "next";
  if (state.pageIndex < lastPageIndex) return "prev";
  return "none";
}
