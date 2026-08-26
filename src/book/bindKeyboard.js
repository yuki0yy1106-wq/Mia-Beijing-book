export function bindKeyboard(controller, isBusy = () => false) {
  function onKeyDown(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.repeat) return;
    if (isBusy()) return;

    const { isCover } = controller.getState();

    if (event.key === "ArrowRight") {
      if (isCover) {
        controller.startReading();
      } else {
        controller.next();
      }
    }

    if (event.key === "ArrowLeft" && !isCover) {
      controller.prev();
    }
  }

  window.addEventListener("keydown", onKeyDown);
  return () => window.removeEventListener("keydown", onKeyDown);
}
