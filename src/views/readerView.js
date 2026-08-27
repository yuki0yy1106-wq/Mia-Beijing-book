import { STORY_PAGES } from "../data/pages.js";
import { clearInteractions, mountPageInteractions } from "../book/mountInteractions.js";

/**
 * Renders one story page and mounts its interactions (if any).
 */
export async function renderReaderPage(pageImage, pageIndex, direction = "none", transition = "flip", actions = {}) {
  const page = STORY_PAGES[pageIndex];
  if (!page) return;
  clearInteractions();
  await pageImage.show(page.src, direction, transition);
  mountPageInteractions(pageImage, page, actions);
}
