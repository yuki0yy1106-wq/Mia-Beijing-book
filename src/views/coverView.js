import { COVER_PAGE } from "../data/pages.js";
import { clearInteractions } from "../book/mountInteractions.js";

export async function renderCover(pageImage, direction = "none", transition = "flip") {
  clearInteractions();
  await pageImage.show(COVER_PAGE.src, direction, transition);
}
