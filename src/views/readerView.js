import { STORY_PAGES } from "../data/pages.js";

/**
 * Renders one story page. Future per-page interactions can be mounted
 * from `page.interactions` here without changing other views.
 */
export function renderReaderPage(pageImage, pageIndex, direction = "none") {
  const page = STORY_PAGES[pageIndex];
  if (!page) return;
  return pageImage.show(page.src, direction);
  // Reserved: mountPageInteractions(page)
}
