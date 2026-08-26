/**
 * Page registry. Each entry is one full-page illustration.
 * `interactions` is reserved so later features can attach to a single page
 * without changing the reader loop.
 */
const IMAGE_DIR = "./public/images";

export const COVER_PAGE = {
  id: "cover",
  src: `${IMAGE_DIR}/cover.png`,
  kind: "cover",
  interactions: [],
};

export const STORY_PAGES = [
  { id: "p1", src: `${IMAGE_DIR}/p1.png`, kind: "story", interactions: [] },
  { id: "p2", src: `${IMAGE_DIR}/p2.png`, kind: "story", interactions: [] },
  { id: "p3", src: `${IMAGE_DIR}/p3.jpg`, kind: "story", interactions: [] },
  { id: "p4", src: `${IMAGE_DIR}/p4.jpg`, kind: "story", interactions: [] },
  { id: "p5", src: `${IMAGE_DIR}/p5.jpg`, kind: "story", interactions: [] },
  { id: "p6", src: `${IMAGE_DIR}/p6.png`, kind: "story", interactions: [] },
  { id: "p7", src: `${IMAGE_DIR}/p7.jpg`, kind: "story", interactions: [] },
  { id: "p8", src: `${IMAGE_DIR}/p8.jpg`, kind: "story", interactions: [] },
  { id: "p9", src: `${IMAGE_DIR}/p9.jpg`, kind: "story", interactions: [] },
  { id: "p10", src: `${IMAGE_DIR}/p10.jpg`, kind: "story", interactions: [] },
  { id: "p11", src: `${IMAGE_DIR}/p11.jpg`, kind: "story", interactions: [] },
  { id: "p12", src: `${IMAGE_DIR}/p12.jpg`, kind: "story", interactions: [] },
  { id: "p13", src: `${IMAGE_DIR}/p13.jpg`, kind: "story", interactions: [] },
  { id: "p14", src: `${IMAGE_DIR}/p14.jpg`, kind: "story", interactions: [] },
  { id: "p15", src: `${IMAGE_DIR}/p15.jpg`, kind: "story", interactions: [] },
  { id: "p16", src: `${IMAGE_DIR}/p16.jpg`, kind: "story", interactions: [] },
  { id: "p17", src: `${IMAGE_DIR}/p17.jpg`, kind: "story", interactions: [] },
  { id: "p18", src: `${IMAGE_DIR}/p18.jpg`, kind: "story", interactions: [] },
  { id: "p19", src: `${IMAGE_DIR}/p19.jpg`, kind: "story", interactions: [] },
];

export const LAST_PAGE_INDEX = STORY_PAGES.length - 1;
