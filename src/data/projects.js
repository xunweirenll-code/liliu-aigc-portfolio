const imageRange = (folder, prefix, count, ext = "webp") =>
  Array.from({ length: count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return `/assets/images/${folder}/${prefix}-${number}.${ext}`;
  });

export const lookbookCategories = [
  { id: "all", label: "全部", enLabel: "All" },
  { id: "knitwear", label: "针织", enLabel: "Knitwear" },
  { id: "formal", label: "礼服", enLabel: "Formal" },
  { id: "suiting", label: "西服", enLabel: "Suiting" },
  { id: "acetate", label: "醋酸", enLabel: "Acetate" },
  { id: "lace", label: "蕾丝", enLabel: "Lace" },
  { id: "casual", label: "日常", enLabel: "Casual" },
  { id: "sportswear", label: "运动", enLabel: "Sportswear" },
];

const lookbookLookNumbers = {
  knitwear: [
    [4, 2, 3, 1],
    [8, 6, 7, 5],
    [13, 10, 11, 9],
    [14, 15, 17, 18],
    [19, 20, 21, 22],
  ],
  formal: [
    [1, 3, 4, 2],
    [8, 6, 5, 7],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
    [17, 18, 19, 20],
  ],
  suiting: [
    [5, 2, 3, 1],
    [10, 7, 8, 6],
    [15, 12, 13, 11],
  ],
  acetate: [
    [4, 2, 3, 1],
    [9, 6, 7, 5],
    [13, 11, 12, 10],
    [14, 15, 16, 17],
    [18, 19, 20, 21],
  ],
  lace: [
    [4, 2, 3, 1],
    [8, 6, 7, 5],
    [13, 10, 11, 9],
    [14, 15, 16, 17],
  ],
  casual: [
    [5, 2, 3, 1],
    [10, 7, 8, 6],
  ],
  sportswear: [
    [1, 2, 4, 3],
    [5, 6, 8, 7],
    [9, 10, 12, 11],
  ],
};

export const lookbookViewOrder = [
  { id: "front", label: "正视图", enLabel: "Front View" },
  { id: "side", label: "侧视图", enLabel: "Side View" },
  { id: "detail", label: "特写放大图", enLabel: "Detail Close-up" },
  { id: "back", label: "背视图", enLabel: "Back View" },
];

const lookbookLabelByCategory = Object.fromEntries(lookbookCategories.map(({ id, label, enLabel }) => [id, { label, enLabel }]));

const lookbookImage = (category, number, viewIndex = 0) => {
  const fileNumber = category === "sportswear" ? String(number) : String(number).padStart(2, "0");
  const fileName = `lookbook-${category}-${fileNumber}`;
  const version = category === "formal" && number === 10 ? "?v=formal-10-updated" : "";
  const view = lookbookViewOrder[viewIndex] || lookbookViewOrder[0];

  return {
    id: fileName,
    category,
    src: `/assets/images/lookbook/${category}/${fileName}.webp${version}`,
    alt: `${lookbookLabelByCategory[category]?.enLabel || category} ${view.enLabel}`,
    view: view.id,
    viewLabel: view.label,
    enViewLabel: view.enLabel,
  };
};

const accessoryLookNumbers = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
  [13, 14, 15],
];

const accessoryImage = (number, viewIndex = 0) => {
  const viewLabel = `图 ${viewIndex + 1}`;
  const enViewLabel = `Image ${viewIndex + 1}`;

  return {
    id: `accessories-${number}`,
    category: "accessories",
    src: `/assets/images/accessories/accessories (${number}).webp`,
    alt: `AI Hair Accessories ${enViewLabel}`,
    view: `image-${viewIndex + 1}`,
    viewLabel,
    enViewLabel,
  };
};

const standardLookbookGroups = Object.entries(lookbookLookNumbers).flatMap(([category, looks]) => {
  const categoryLabel = lookbookLabelByCategory[category]?.label || category;
  const categoryEnLabel = lookbookLabelByCategory[category]?.enLabel || category;

  return looks.map((lookNumbers, index) => {
    const images = lookNumbers.map((number, viewIndex) => lookbookImage(category, number, viewIndex));
    const lookNumber = String(index + 1).padStart(2, "0");

    return {
      id: `${category}-look-${lookNumber}`,
      category,
      categoryLabel,
      categoryEnLabel,
      title: `${categoryLabel} Look ${lookNumber}`,
      enTitle: `${categoryEnLabel} Look ${lookNumber}`,
      cover: images[0],
      images,
    };
  });
});

export const accessoryLookbookGroups = accessoryLookNumbers.map((lookNumbers, index) => {
  const category = "accessories";
  const categoryLabel = lookbookLabelByCategory[category]?.label || "AI发饰佩戴";
  const categoryEnLabel = lookbookLabelByCategory[category]?.enLabel || "AI Hair Accessories";
  const images = lookNumbers.map((number, viewIndex) => accessoryImage(number, viewIndex));
  const lookNumber = String(index + 1).padStart(2, "0");

  return {
    id: `${category}-look-${lookNumber}`,
    category,
    categoryLabel,
    categoryEnLabel,
    title: `${categoryLabel} Look ${lookNumber}`,
    enTitle: `${categoryEnLabel} Look ${lookNumber}`,
    cover: images[0],
    images,
  };
});

export const lookbookGroups = standardLookbookGroups;

export const lookbookImages = lookbookGroups.flatMap((group) => group.images);

const fashionModelImageNumbers = [1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21];
const fashionBrandImages = fashionModelImageNumbers.map((number) => {
  const fileNumber = String(number).padStart(2, "0");

  return `/assets/images/fashion/ai-fashion-${fileNumber}.webp`;
});

const fashionModelImage = (number, groupTitle, index) => {
  const fileNumber = String(number).padStart(2, "0");

  return {
    id: `ai-fashion-${fileNumber}`,
    src: `/assets/images/fashion/ai-fashion-${fileNumber}.webp`,
    alt: `${groupTitle} image ${index + 1}`,
    viewLabel: `图 ${index + 1}`,
    enViewLabel: `Image ${index + 1}`,
  };
};

const fashionModelGroup = ({ id, title, enTitle, numbers }) => {
  const images = numbers.map((number, index) => fashionModelImage(number, enTitle, index));

  return {
    id,
    title,
    enTitle,
    category: "fashion-model",
    categoryLabel: "AI服装模特",
    categoryEnLabel: "AI Fashion Model",
    cover: images[0],
    images,
  };
};

export const fashionModelSections = [
  {
    id: "nana-jacqueline",
    title: "Nana Jacqueline 品牌服装展示",
    enTitle: "Nana Jacqueline Fashion Showcase",
    groups: [
      fashionModelGroup({
        id: "nana-jacqueline-look-01",
        title: "Nana Jacqueline Look 01",
        enTitle: "Nana Jacqueline Look 01",
        numbers: [2, 5, 3, 4, 1],
      }),
      fashionModelGroup({
        id: "nana-jacqueline-look-02",
        title: "Nana Jacqueline Look 02",
        enTitle: "Nana Jacqueline Look 02",
        numbers: [11, 15, 13, 14, 12],
      }),
    ],
  },
  {
    id: "saiwei",
    title: "赛维时代品牌服装展示",
    enTitle: "Saiwei Brand Fashion Showcase",
    groups: [
      fashionModelGroup({
        id: "saiwei-look-01",
        title: "赛维时代 Look 01",
        enTitle: "Saiwei Look 01",
        numbers: [17, 18, 19, 20, 21],
      }),
    ],
  },
];
const clothingStillImages = Array.from({ length: 12 }, (_, index) => {
  const number = index + 1;

  return `/assets/images/clothing/clothing-(${number}).webp`;
});
const jewelryTryOnImages = Array.from({ length: 18 }, (_, index) => {
  const number = index + 1;

  return `/assets/images/jewelry/ai-jewelry/ai-jewelry- (${number}).webp`;
});
const jewelryCreativeImages = Array.from({ length: 6 }, (_, index) => {
  const number = index + 1;

  return `/assets/images/jewelry/Jewelry Creativity/Jewelry Creativity  (${number}).webp`;
});
const jewelryFinishingImages = Array.from({ length: 6 }, (_, index) => {
  const number = index + 1;

  return `/assets/images/jewelry/Jewelry finishing/Jewelry finishing-${number}.webp`;
});
const eventVisualImage = (number) => `/assets/images/Operational Design/Event Visuals/Operational Design (${number}).webp`;
const eventVisualSections = [
  {
    id: "main-kv",
    title: "主KV",
    enTitle: "Main KV",
    layout: "kv",
    images: [eventVisualImage(0)],
  },
  {
    id: "poster",
    title: "海报",
    enTitle: "Poster",
    layout: "triptych",
    images: [eventVisualImage(1), eventVisualImage(2), eventVisualImage(3)],
  },
  {
    id: "h5",
    title: "H5页面",
    enTitle: "H5 Pages",
    layout: "triptych",
    images: [eventVisualImage(5), eventVisualImage(6), eventVisualImage(7)],
  },
  {
    id: "display-gift",
    title: "广告展示和礼物周边",
    enTitle: "Display & Gifts",
    layout: "merch",
    images: [eventVisualImage(8), eventVisualImage(9), eventVisualImage(10), eventVisualImage(11), eventVisualImage(12)],
  },
];
const productMainImages = imageRange("product/主副图", "ai-product", 15).slice(8);
const productAPlusImages = imageRange("product/A+图", "ai-product", 8);
const productImages = [...productMainImages, ...productAPlusImages];
const productSections = [
  {
    id: "main",
    title: "主副图",
    images: productMainImages,
  },
  {
    id: "aplus",
    title: "A+图",
    images: productAPlusImages,
  },
];
const fashionVideos = [
  "/assets/videos/ai服装模特/ai-video-01.mp4",
  "/assets/videos/ai服装模特/ai-video-02.mp4",
  "/assets/videos/ai服装模特/ai-video-03.mp4",
];

const baseProcess = ["需求拆解", "参考素材整理", "视觉方向确认", "AI 生成与筛选", "局部修复与质检", "整理交付"];
const placeholderProcess = ["明确内容方向", "等待素材补充", "建立展示结构", "补充封面与案例图", "完善项目说明"];

export const projectGroups = [
  {
    id: "commercial-visual",
    number: "01",
    title: "AI 商业视觉",
    description: "面向品牌、电商、产品与空间场景的 AI 商业图像系列。",
    categories: [
      {
        id: "lookbook",
        title: "AI Lookbook",
        description: "按材质、风格和场景组织的服装系列视觉。",
        projectSlugs: ["ai-lookbook"],
      },
      {
        id: "fashion-model",
        title: "AI服装模特",
        description: "服装模特形象、品牌主视觉与商业氛围表达。",
        projectSlugs: ["ai-fashion-model"],
      },
      {
        id: "hair-accessories",
        title: "AI发饰佩戴",
        description: "以发饰造型为单位组织的 AI 佩戴视觉展示。",
        projectSlugs: ["ai-hair-accessories"],
      },
      {
        id: "fashion-visual",
        title: "AI 服装视觉",
        description: "服装单品、版型细节与系列化服装视觉。",
        projectSlugs: ["ai-clothing-visual"],
      },
      {
        id: "jewelry",
        title: "AI珠宝佩戴",
        description: "珠宝、配饰与佩戴场景的商业视觉。",
        projectSlugs: ["ai-jewelry-try-on"],
      },
      {
        id: "product",
        title: "AI产品图",
        description: "电商主图、A+ 内容与产品广告图像。",
        projectSlugs: ["ai-product-visual"],
      },
    ],
  },
  {
    id: "commercial-video",
    number: "02",
    title: "AI 商业视频",
    description: "将静态视觉延展为短视频、产品展示和服装动态内容。",
    categories: [
      {
        id: "lookbook-showcase-video",
        title: "AI Lookbook展示",
        description: "面向 Lookbook 系列展示的视频内容。",
        projectSlugs: ["ai-lookbook-showcase-video"],
      },
      {
        id: "fashion-video",
        title: "AI服装模特展示",
        description: "服装模特动态、走秀和姿态展示。",
        projectSlugs: ["ai-fashion-model-video"],
      },
      {
        id: "lookbook-video",
        title: "AI服装模特街拍",
        description: "服装系列感与 Lookbook 镜头语言。",
        projectSlugs: ["ai-lookbook-video"],
      },
      {
        id: "product-video",
        title: "3C 产品展示视频",
        description: "产品广告、功能展示和短视频物料。",
        projectSlugs: ["ai-product-video"],
      },
    ],
  },
  {
    id: "operation-visual",
    number: "03",
    title: "AI 运营视觉",
    description: "用于营销和活动专题的视觉内容框架。",
    categories: [
      {
        id: "event",
        title: "AI 活动专题视觉",
        description: "用于活动专题页、Campaign 延展和视觉包装。",
        projectSlugs: ["ai-event-visual"],
      },
    ],
  },
  {
    id: "lora-training",
    number: "04",
    title: "Lora模型训练",
    description: "为后续风格模型、角色模型和效果对比预留展示结构。",
    categories: [
      {
        id: "character-lora",
        title: "角色Lora模型",
        description: "角色一致性、训练样本和效果对比。",
        projectSlugs: ["character-lora-model"],
      },
      {
        id: "style-lora",
        title: "风格Lora模型",
        description: "风格样本、训练过程与应用结果。",
        projectSlugs: ["style-lora-model"],
      },
    ],
  },
];

export const projects = [
  {
    slug: "ai-fashion-model",
    group: "commercial-visual",
    category: "fashion-model",
    title: "AI服装模特",
    subtitle: "用于服装模特形象、品牌主视觉和商业氛围表达的 AI 模特视觉项目。",
    type: "AI服装模特",
    isFashionModel: true,
    tags: ["AI Fashion", "Model Consistency", "Commercial Visual"],
    cover: "/assets/images/fashion/ai-fashion-01.webp",
    images: fashionBrandImages,
    videos: [],
    description: "以服装品牌气质、模特状态和商业氛围表达为核心，建立可延展的 AI 服装模特视觉项目结构。",
    role: "视觉方向设定 / AI 图像生成 / 模特一致性控制 / 精修筛选",
    process: baseProcess,
    result: "形成覆盖品牌形象和服装模特表达的 AI 视觉资产，可支撑新品主视觉、系列展示和内容测试。",
    subSections: [
      {
        number: "01",
        title: "AI 服装品牌形象视觉",
        description: "用于品牌主视觉、服装模特形象和商业氛围表达。",
        tags: ["AI Fashion", "Brand Image", "Model Visual"],
        images: fashionBrandImages,
      },
      {
        number: "02",
        title: "Lookbook 系列",
        description: "按材质、风格和场景组织的服装系列视觉。",
        tags: ["Lookbook", "Fashion Series", "Material Style"],
        images: lookbookImages,
      },
      {
        number: "03",
        title: "服装静物",
        description: "用于服装单品、版型细节和电商内容的静物视觉。",
        tags: ["Still Life", "Clothing", "Product Detail"],
        images: clothingStillImages,
      },
    ],
  },
  {
    slug: "ai-lookbook",
    group: "commercial-visual",
    category: "lookbook",
    title: "AI Lookbook",
    subtitle: "覆盖不同材质、风格和场景的服装系列视觉探索。",
    type: "AI Lookbook",
    tags: ["Lookbook", "Fashion", "Material Style"],
    cover: "/assets/images/lookbook/formal/lookbook-formal-09.webp",
    coverPosition: "center 8%",
    images: lookbookImages,
    videos: [],
    description: "围绕醋酸、蕾丝、礼服、日常、西服、运动与针织等风格，建立可筛选的 AI Lookbook 展示体系。",
    role: "Lookbook 视觉规划 / 材质风格拆分 / 系列化生成 / 图像筛选",
    process: ["拆分材质与风格标签", "设置系列化视觉规则", "按分类生成画面", "统一比例和调性", "沉淀可扩展的 Lookbook 资产库"],
    result: "得到具备系列感和商业展示感的服装 Lookbook，可继续扩展为品牌季节视觉或提案素材。",
    isLookbook: true,
    hideDetailIntroSections: true,
  },
  {
    slug: "ai-hair-accessories",
    group: "commercial-visual",
    category: "hair-accessories",
    title: "AI发饰佩戴",
    subtitle: "以同一套发饰造型为单位组织的 AI 佩戴视觉。",
    type: "AI发饰佩戴",
    tags: ["Hair Accessories", "Try-on", "Lookbook"],
    cover: "/assets/images/accessories/accessories (1).webp",
    coverPosition: "center 18%",
    images: accessoryLookbookGroups.flatMap((group) => group.images),
    videos: [],
    description: "围绕发饰佩戴角度、造型细节与人像状态，建立可按套系查看的 AI 发饰佩戴视觉。",
    role: "发饰造型分组 / 佩戴角度整理 / 图像生成与筛选",
    process: baseProcess,
    result: "形成按套系分组的 AI 发饰佩戴视觉资产，可用于详情页、品牌内容和社媒展示。",
    isAccessoryLookbook: true,
    hideDetailIntroSections: true,
  },
  {
    slug: "ai-clothing-visual",
    group: "commercial-visual",
    category: "fashion-visual",
    title: "AI 服装视觉",
    subtitle: "用于服装单品、版型细节和电商内容的静物视觉。",
    type: "AI 服装视觉",
    hideDetailIntroSections: true,
    preserveImageRatio: true,
    visualOutputTitle: "赛维时代男装平铺图",
    tags: ["Clothing", "Still Life", "Product Detail"],
    cover: "/assets/images/clothing/clothing-(2).webp",
    images: clothingStillImages,
    videos: [],
    description: "聚焦服装单品、材质细节、版型展示和电商视觉表达，建立适合商品展示与内容延展的 AI 服装视觉。",
    role: "服装单品方向 / 材质细节控制 / 图像生成 / 精修筛选",
    process: baseProcess,
    result: "形成可用于详情页、系列陈列和内容测试的 AI 服装视觉资产。",
  },
  {
    slug: "ai-jewelry-try-on",
    group: "commercial-visual",
    category: "jewelry",
    title: "AI珠宝佩戴",
    subtitle: "用于珠宝、配饰和佩戴场景的商业视觉表达。",
    type: "AI珠宝佩戴",
    tags: ["Jewelry", "Try-on", "Commercial Retouching"],
    cover: "/assets/images/jewelry/ai-jewelry/ai-jewelry- (1).webp",
    hideDetailIntroSections: true,
    preserveImageRatio: true,
    images: [...jewelryTryOnImages, ...jewelryFinishingImages, ...jewelryCreativeImages],
    jewelrySections: [
      {
        id: "jewelry-try-on",
        title: "AI珠宝佩戴模特",
        enTitle: "AI Jewelry Try-on",
        caption: "拓璞施珠宝",
        images: jewelryTryOnImages,
      },
      {
        id: "jewelry-finishing",
        title: "珠宝精修",
        enTitle: "Jewelry Finishing",
        images: jewelryFinishingImages,
      },
      {
        id: "jewelry-creativity",
        title: "珠宝创意图",
        enTitle: "Jewelry Creativity",
        caption: "Nana Jacqualine珠宝",
        images: jewelryCreativeImages,
      },
    ],
    videos: [],
    description: "聚焦珠宝细节、佩戴氛围与人像状态，构建兼具质感和销售表达的 AI 珠宝视觉。",
    role: "佩戴场景设定 / 产品质感控制 / 局部修复 / 商业图筛选",
    process: baseProcess,
    result: "形成适合社媒、详情页和品牌内容使用的珠宝佩戴视觉组合。",
  },
  {
    slug: "ai-product-visual",
    group: "commercial-visual",
    category: "product",
    title: "AI产品图",
    subtitle: "面向电商主图、A+ 内容和广告物料的产品图像。",
    type: "AI产品图",
    hideDetailIntroSections: true,
    tags: ["Product", "E-commerce", "A+ Content"],
    cover: "/assets/images/product/主副图/ai-product-09.webp",
    images: productImages,
    productSections,
    visualOutputTitle: "亚马逊视觉",
    videos: [],
    description: "以产品识别度、卖点表达和画面秩序为重点，构建可用于电商和广告场景的 AI 产品商业图。",
    role: "产品视觉策略 / 场景生成 / 主副图规划 / A+ 内容占位",
    process: baseProcess,
    result: "为产品页、广告投放和提案提供清晰、可替换的视觉基础。",
  },
  {
    slug: "ai-interior-space",
    group: "commercial-visual",
    category: "interior",
    title: "AI家居与空间",
    subtitle: "基于空间审美和商业表达的场景视觉方向。",
    type: "AI家居与空间",
    tags: ["Interior", "Space", "Scene Generation"],
    cover: "/assets/images/product/A+图/ai-product-01.webp",
    images: imageRange("product/A+图", "ai-product", 8),
    videos: [],
    description: "当前暂无独立 interior 素材目录，先使用本地产品视觉作为占位，后续可直接替换为空间作品。",
    role: "空间氛围设定 / 场景方向规划 / 图像筛选 / 商业表达梳理",
    process: baseProcess,
    result: "保留家居与空间视觉项目结构，等待后续补充真实空间素材。",
  },
  {
    slug: "ai-event-visual",
    group: "operation-visual",
    category: "event",
    title: "AI 活动专题视觉",
    subtitle: "用于活动专题、Campaign 延展和页面包装的视觉方向。",
    type: "AI 运营视觉",
    tags: ["Event", "Campaign Extension", "Topic Visual"],
    cover: "/assets/images/Operational Design/Event Visuals/Operational Design (0).webp",
    hideDetailIntroSections: true,
    preserveImageRatio: true,
    images: eventVisualSections.flatMap((section) => section.images),
    eventVisualSections,
    videos: [],
    description: "暂未发现独立活动专题素材，先保留项目结构，后续可补充专题页或活动物料。",
    role: "活动主题视觉 / 延展规范 / 专题内容包装",
    process: placeholderProcess,
    result: "占位展示活动专题视觉方向，后续可补充真实专题案例。",
    placeholder: false,
  },
  {
    slug: "ai-lookbook-showcase-video",
    group: "commercial-video",
    category: "lookbook-showcase-video",
    title: "AI Lookbook展示",
    subtitle: "Lookbook Fashion Video",
    type: "AI 商业视频",
    tags: ["Lookbook", "Fashion Video", "AI Motion"],
    cover: "/assets/videos/ai服装模特/NJ-lookbook/NJ-lookbook-cover.jpg",
    images: ["/assets/videos/ai服装模特/NJ-lookbook/NJ-lookbook-cover.jpg"],
    videos: ["/assets/videos/ai服装模特/NJ-lookbook/NJ-lookbook.mp4"],
    description: "用于展示 Nana Jacqueline Lookbook 系列服装动态内容。",
    role: "Lookbook 视频方向 / 镜头节奏 / AI 视频生成 / 成片展示",
    process: baseProcess,
    result: "形成可播放的 AI Lookbook 展示视频案例。",
  },
  {
    slug: "ai-fashion-model-video",
    group: "commercial-video",
    category: "fashion-video",
    title: "AI服装模特展示",
    subtitle: "服装模特动态、走秀和姿态展示视频。",
    type: "AI 商业视频",
    tags: ["AI Fashion", "Video", "Motion"],
    cover: "/assets/videos/ai服装模特/ai-video-cover-01.jpg",
    images: ["/assets/videos/ai服装模特/ai-video-cover-01.jpg", "/assets/videos/ai服装模特/ai-video-cover-02.jpg"],
    videos: [fashionVideos[0], fashionVideos[2]],
    description: "将 AI 服装视觉延展为动态视频，用于展示模特姿态、服装氛围和短视频内容。",
    role: "视频方向设定 / 镜头节奏规划 / AI 视频生成 / 剪辑整理",
    process: baseProcess,
    result: "形成可用于作品集展示的本地 AI 服装模特视频案例。",
  },
  {
    slug: "ai-lookbook-video",
    group: "commercial-video",
    category: "lookbook-video",
    title: "AI服装模特街拍",
    subtitle: "面向服装系列感和 Lookbook 镜头语言的视频表达。",
    type: "AI 商业视频",
    tags: ["Lookbook", "Fashion Video", "AI Motion"],
    cover: "/assets/videos/ai服装模特/ai-video-cover-02.jpg",
    images: ["/assets/videos/ai服装模特/ai-video-cover-02.jpg"],
    videos: [fashionVideos[1]],
    description: "以服装系列感、人物状态和画面节奏为重点，保留后续扩展为完整 Lookbook 视频的结构。",
    role: "系列视觉设定 / 镜头方向 / AI 视频生成 / 片段筛选",
    process: baseProcess,
    result: "形成适合作品集展示的 AI Lookbook 视频项目入口。",
  },
  {
    slug: "ai-product-video",
    group: "commercial-video",
    category: "product-video",
    title: "3C 产品展示视频",
    subtitle: "面向 3C 产品广告和功能展示的短视频素材。",
    type: "AI 商业视频",
    tags: ["3C Product", "Commercial Video", "AI Video"],
    cover: "/assets/videos/耳机广告2/ai-video-cover-03.jpg",
    images: ["/assets/videos/耳机广告2/ai-video-cover-03.jpg"],
    videos: ["/assets/videos/耳机广告2/ai-video-04.mp4"],
    description: "用于展示产品质感、功能氛围和广告节奏的 AI 3C 产品视频。",
    role: "产品视频方向 / 镜头节奏 / AI 视频生成 / 成片筛选",
    process: baseProcess,
    result: "形成可播放的本地 3C 产品展示视频案例。",
  },
  {
    slug: "style-lora-model",
    group: "lora-training",
    category: "style-lora",
    title: "风格Lora模型",
    detailTitle: "毛绒玩偶风格Lora模型训练",
    subtitle: "毛绒玩偶风格训练、测试与应用展示。",
    type: "Lora模型训练",
    tags: ["Style LoRA", "Training", "AIGC Workflow"],
    cover: "/assets/images/lora/lora2/lora2-cover.webp",
    images: [
      "/assets/images/lora/lora2/lora2 (1).jpg",
      "/assets/images/lora/lora2/lora2 (2).jpg",
      "/assets/images/lora/lora2/lora2 (3).jpg",
    ],
    videos: [],
    loraSections: [
      {
        title: "1.训练集准备",
        image: "/assets/images/lora/lora2/lora2 (1).jpg",
      },
      {
        title: "2.模型训练和测试",
        image: "/assets/images/lora/lora2/lora2 (2).jpg",
      },
      {
        title: "3.风格测试",
        image: "/assets/images/lora/lora2/lora2 (3).jpg",
      },
    ],
    description: "围绕毛绒玩偶视觉风格进行 LoRA 模型训练、过程测试和风格应用验证。",
    role: "训练样本整理 / 风格方向确认 / 模型效果对比",
    process: placeholderProcess,
    result: "形成可用于后续系列化生成的毛绒玩偶风格模型展示结构。",
    hideDetailIntroSections: true,
    preserveImageRatio: true,
    placeholder: false,
  },
  {
    slug: "character-lora-model",
    group: "lora-training",
    category: "character-lora",
    title: "角色Lora模型",
    detailTitle: "角色Lora模型训练",
    subtitle: "角色训练集、模型测试与场景应用展示。",
    type: "Lora模型训练",
    tags: ["Character LoRA", "Consistency", "Model Training"],
    cover: "/assets/images/lora/lora1/lora1 -cover2.webp",
    images: [
      "/assets/images/lora/lora1/lora1 (1).jpg",
      "/assets/images/lora/lora1/lora1 (2).jpg",
      "/assets/images/lora/lora1/lora1 (3).jpg",
    ],
    videos: [],
    loraSections: [
      {
        title: "1.训练集准备",
        image: "/assets/images/lora/lora1/lora1 (1).jpg",
      },
      {
        title: "2.模型训练和测试",
        image: "/assets/images/lora/lora1/lora1 (2).jpg",
      },
      {
        title: "3.场景测试",
        image: "/assets/images/lora/lora1/lora1 (3).jpg",
      },
    ],
    description: "围绕角色一致性进行 LoRA 模型训练、模型测试和场景应用验证。",
    role: "角色样本整理 / 一致性控制 / 训练结果复盘",
    process: placeholderProcess,
    result: "形成可用于不同场景测试的角色 LoRA 模型展示结构。",
    hideDetailIntroSections: true,
    preserveImageRatio: true,
    placeholder: false,
  },
];

export const workFilters = projectGroups.map(({ id, title }) => ({
  id,
  label: title,
  enLabel: title,
}));
