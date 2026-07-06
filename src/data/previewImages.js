const previewImageFiles = [
  "accessories (10).webp",
  "accessories (13).webp",
  "accessories (3).webp",
  "accessories (5).webp",
  "accessories (7).webp",
  "ai-fashion-03.webp",
  "ai-fashion-04.webp",
  "ai-fashion-11.webp",
  "ai-fashion-13.webp",
  "ai-fashion-15.webp",
  "ai-fashion-17.webp",
  "ai-fashion-20.webp",
  "ai-fashion-21.webp",
  "ai-jewelry- (1).webp",
  "ai-jewelry- (2).webp",
  "ai-jewelry- (3).webp",
  "ai-jewelry- (4).webp",
  "ai-jewelry- (6).webp",
  "ai-jewelry- (9).webp",
  "ai-product-11.webp",
  "ai-product-13.webp",
  "ai-product-15.webp",
  "car (1).webp",
  "car (2).webp",
  "car (3).webp",
  "clothing-(1).webp",
  "clothing-(2).webp",
  "clothing-(3).webp",
  "clothing-(5).webp",
  "interior design (1).webp",
  "interior design (2).webp",
  "Jewelry Creativity  (1).webp",
  "Jewelry Creativity  (2).webp",
  "Jewelry Creativity  (3).webp",
  "Jewelry Creativity  (4).webp",
  "Jewelry Creativity  (5).webp",
  "Jewelry finishing-1.webp",
  "Jewelry finishing-2.webp",
  "lookbook-acetate-01.webp",
  "lookbook-acetate-20.webp",
  "lookbook-casual-03.webp",
  "lookbook-casual-08.webp",
  "lookbook-formal-07.webp",
  "lookbook-formal-10.webp",
  "lookbook-formal-15.webp",
  "lookbook-formal-19.webp",
  "lookbook-formal-20.webp",
  "lookbook-knitwear-02.webp",
  "lookbook-knitwear-06.webp",
  "lookbook-knitwear-10.webp",
  "lookbook-knitwear-14.webp",
  "lookbook-knitwear-15.webp",
  "lookbook-knitwear-20.webp",
  "lookbook-knitwear-21.webp",
  "lookbook-lace-04.webp",
  "lookbook-lace-06.webp",
  "lookbook-lace-07.webp",
  "lookbook-lace-11.webp",
  "lookbook-lace-13.webp",
  "lookbook-lace-15.webp",
  "lookbook-sportswear-10.webp",
  "lookbook-sportswear-3.webp",
  "lookbook-sportswear-5.webp",
  "lookbook-suiting-03.webp",
  "lookbook-suiting-07.webp",
  "lookbook-suiting-15.webp",
];

const lanes = [-46, -34, -22, -10, 10, 22, 34, 46];
const laneSequence = [3, 4, 2, 5, 3, 4, 1, 6, 2, 5, 0, 7, 3, 4, 2, 5, 1, 6, 3, 4, 2, 5, 0, 7, 3, 4, 2, 5, 1, 6, 3, 4];
const laneOffsets = [148, 62, 124, 22, 156, 78, 136, 46];
const widths = [87, 92, 98, 104, 112, 118, 124, 90, 96, 108, 116, 122, 100, 110];
const rotations = [-3.5, 2.5, -1.5, 3.2, -2.6, 1.4, 3.8, -3.1, 0.8, -0.9, 2.1];
const laneSpeeds = [1, 1.005, 0.995, 1, 1, 0.995, 1.005, 1];

const getCategory = (fileName) => {
  const normalized = fileName.toLowerCase();

  if (normalized.includes("lookbook")) return "Lookbook";
  if (normalized.includes("fashion")) return "AI Fashion";
  if (normalized.includes("jewelry")) return "Jewelry";
  if (normalized.includes("accessories")) return "Accessories";
  if (normalized.includes("product")) return "Product";
  if (normalized.includes("clothing")) return "Clothing";
  if (normalized.includes("interior")) return "Interior";
  if (normalized.includes("car")) return "Automotive";
  return "AIGC Visual";
};

const getAltText = (fileName) => `${getCategory(fileName)} preview image`;

const laneCounts = new Map();

export const previewImages = previewImageFiles.map((fileName, index) => {
  const column = laneSequence[index % laneSequence.length];
  const columnRound = laneCounts.get(column) ?? 0;
  laneCounts.set(column, columnRound + 1);
  const lane = lanes[column];
  const laneDrift = ((columnRound % 3) - 1) * 0.45;
  const rhythmOffset = (index % 3) * 10 + ((index * 11) % 19);
  const initialY = laneOffsets[column] + columnRound * 230 + rhythmOffset;

  return {
    src: `/assets/images/previewImages/${fileName}`,
    alt: getAltText(fileName),
    category: getCategory(fileName),
    column,
    x: `${lane + laneDrift}vw`,
    y: initialY,
    width: widths[(index * 5 + columnRound) % widths.length],
    rotation: rotations[(index * 3 + columnRound) % rotations.length],
    speed: laneSpeeds[column],
    depth: laneSpeeds[column],
  };
});
