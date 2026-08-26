import { COVER_PAGE } from "../data/pages.js";

export function renderCover(pageImage, direction = "none") {
  return pageImage.show(COVER_PAGE.src, direction);
}
