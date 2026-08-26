import { LAST_PAGE_INDEX } from "../data/pages.js";

export function createBookController() {
  /** @type {"cover" | "reading"} */
  let screen = "cover";
  let pageIndex = 0;
  const listeners = new Set();

  function getState() {
    return {
      screen,
      pageIndex,
      isCover: screen === "cover",
      isFirstPage: screen === "reading" && pageIndex === 0,
      isLastPage: screen === "reading" && pageIndex === LAST_PAGE_INDEX,
      canGoPrev: screen === "reading",
      canGoNext: screen === "reading" && pageIndex < LAST_PAGE_INDEX,
    };
  }

  function emit() {
    const state = getState();
    listeners.forEach((fn) => fn(state));
  }

  return {
    getState,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    startReading() {
      screen = "reading";
      pageIndex = 0;
      emit();
    },
    next() {
      const { canGoNext } = getState();
      if (!canGoNext) return;
      pageIndex += 1;
      emit();
    },
    prev() {
      const { canGoPrev, isFirstPage } = getState();
      if (!canGoPrev) return;
      if (isFirstPage) {
        screen = "cover";
        pageIndex = 0;
      } else {
        pageIndex -= 1;
      }
      emit();
    },
  };
}
