# AIGC 商业视觉作品集网站

这是一个从零搭建的 React + Vite 个人作品集网站，面向 HR、面试官和客户展示 AI 商业视觉、AI 服装模特、Lookbook、珠宝佩戴、产品商业图、AI 视频、工作流和商业交付 SOP。

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址通常是 `http://localhost:5173/`。

## 打包发布

```bash
npm run build
npm run preview
```

打包结果会生成在 `dist/`。构建脚本会额外复制一份 `dist/404.html`，方便 GitHub Pages 在前端路由刷新时回落到首页。

## 替换图片和视频素材

所有公开素材都放在 `public/assets/` 下，页面引用路径以 `/assets/...` 开头。

- 图片：`public/assets/images/`
- 视频：`public/assets/videos/`
- 简历：`public/assets/resume/`

建议继续沿用当前命名方式，例如：

- `public/assets/images/fashion/ai-fashion-22.png`
- `public/assets/images/jewelry/ai-jewelry-26.png`
- `public/assets/videos/新视频目录/my-video.mp4`

添加新素材后，到 `src/data/projects.js` 或 `src/data/videos.js` 更新对应路径即可。

## 新增作品项目

在 `src/data/projects.js` 的 `projects` 数组中新增对象：

```js
{
  slug: "new-project",
  title: "项目标题",
  subtitle: "项目副标题",
  category: "product",
  type: "项目类型",
  tags: ["Tag 1", "Tag 2"],
  cover: "/assets/images/product/主副图/ai-product-09.png",
  images: ["/assets/images/product/主副图/ai-product-09.png"],
  description: "项目说明",
  role: "你的工作内容",
  process: ["步骤 1", "步骤 2"],
  result: "最终成果"
}
```

`slug` 会自动对应详情页路径：`/works/new-project`。

## 修改中英文文案

集中修改 `src/data/i18n.js`。

- `zh` 是默认中文文案。
- `en` 是英文备用文案。
- 导航、首页、页面标题和通用按钮文案都在这里维护。

当前语言切换已经可点击，后续如果要让项目详情内容也完全双语，可以继续把 `projects.js` 中的项目文案拆成 `zh/en` 两套字段。

## Lookbook 分类

Lookbook 分类在 `src/data/projects.js` 的 `lookbookCategories` 中维护：

- 全部
- 醋酸
- 蕾丝
- 礼服
- 日常
- 西服
- 运动
- 针织

对应图片来自：

```text
public/assets/images/lookbook/acetate/
public/assets/images/lookbook/lace/
public/assets/images/lookbook/formal/
public/assets/images/lookbook/casual/
public/assets/images/lookbook/suiting/
public/assets/images/lookbook/sportswear/
public/assets/images/lookbook/knitwear/
```

## 部署到 Vercel

1. 将项目推送到 GitHub。
2. 在 Vercel 新建 Project，选择该仓库。
3. Framework 选择 `Vite`。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `dist`。
6. 部署完成后即可获得线上链接。

## 部署到 Netlify

1. 将项目推送到 GitHub。
2. 在 Netlify 新建站点并连接仓库。
3. Build Command 使用 `npm run build`。
4. Publish Directory 使用 `dist`。
5. 项目已包含 `public/_redirects`，Netlify 会在前端路由刷新时回落到 `index.html`。

## 部署到 GitHub Pages

1. 安装并配置 GitHub Pages 发布流程，或使用 GitHub Actions。
2. 运行 `npm run build`。
3. 发布 `dist/` 目录。
4. 如果部署在仓库子路径，例如 `https://username.github.io/repo-name/`，需要在 `vite.config.js` 中把 `base` 改为 `/repo-name/`。

## 当前素材说明

当前版本没有删除、移动或重命名任何素材文件。家居与空间方向暂未发现独立 `public/assets/images/interior/` 文件夹，因此该项目先使用本地产品视觉作为占位，后续补充空间图片后只需替换 `src/data/projects.js` 中 `ai-interior-space` 的 `cover` 和 `images`。
