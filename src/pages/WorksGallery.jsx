import { useMemo } from "react";
import CircularGallery from "../components/CircularGallery.jsx";
import { projectGroups, projects } from "../data/projects.js";

const getProjectCover = (project) => {
  if (!project) return "";
  if (typeof project.cover === "string") return project.cover;
  return project.cover?.src || project.images?.[0]?.src || project.images?.[0] || "";
};

const getGalleryItems = () =>
  projectGroups
    .flatMap((group) => group.categories)
    .map((category) => {
      const project = projects.find((item) => item.slug === category.projectSlugs?.[0]);

      return {
        image: getProjectCover(project),
        text: category.title,
      };
    })
    .filter((item) => item.image && item.text);

export default function WorksGallery() {
  const items = useMemo(() => getGalleryItems(), []);

  return (
    <section className="page-section anchor-section works-gallery-section" aria-label="作品滚动图片">
      <div className="works-gallery-heading reveal">
        <span>/// SELECTED VISUALS ///</span>
        <h2>项目作品</h2>
      </div>
      <div className="works-gallery-canvas reveal">
        <CircularGallery
          items={items}
          bend={2.6}
          textColor="#777777"
          borderRadius={0.035}
          font='500 22px "Microsoft YaHei", "PingFang SC", sans-serif'
          labelScale={0.1}
          scrollSpeed={2.6}
          scrollEase={0.045}
        />
      </div>
    </section>
  );
}
