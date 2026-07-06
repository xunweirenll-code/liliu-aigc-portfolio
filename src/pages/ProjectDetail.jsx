import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BackButton from "../components/BackButton.jsx";
import FilterTabs from "../components/FilterTabs.jsx";
import ImageGrid from "../components/ImageGrid.jsx";
import LookbookGallery from "../components/LookbookGallery.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { videos } from "../data/videos.js";
import { accessoryLookbookGroups, fashionModelSections, lookbookCategories, lookbookGroups, projects } from "../data/projects.js";

export default function ProjectDetail({ copy, language }) {
  const { slug } = useParams();
  const [lookbookFilter, setLookbookFilter] = useState("all");
  const project = projects.find((item) => item.slug === slug);

  const gallery = useMemo(() => {
    if (!project) return [];
    if (!project.isLookbook) return project.images;
    if (lookbookFilter === "all") return project.images;
    return project.images.filter((image) => image.category === lookbookFilter);
  }, [lookbookFilter, project]);

  const filteredLookbookGroups = useMemo(() => {
    if (!project?.isLookbook) return [];
    if (lookbookFilter === "all") return lookbookGroups;
    return lookbookGroups.filter((group) => group.category === lookbookFilter);
  }, [lookbookFilter, project]);

  if (!project) {
    return (
      <section className="page-section page-top">
        <BackButton />
        <SectionTitle title="项目未找到" intro="请返回作品列表查看当前可访问的作品。" />
        <Link className="button primary" to="/#works">
          {copy.common.backToWorks}
        </Link>
      </section>
    );
  }

  const projectVideos = (project.videos || []).map((src, index) => {
    const videoMeta = videos.find((video) => video.src === src);
    return (
      videoMeta || {
        slug: `${project.slug}-${index}`,
        title: project.title,
        type: project.type,
        description: project.description,
        src,
        poster: project.images?.[0],
      }
    );
  });
  const hideDetailIntroSections = project.isFashionModel || project.hideDetailIntroSections;
  const hideDetailEyebrow = hideDetailIntroSections;
  const hideDetailDescription = hideDetailIntroSections;
  const hideDetailHeroCopy = project.isLookbook;
  const hideDetailHero = project.productSections?.length > 0;

  return (
    <article className="page-section page-top detail-page">
      <BackButton />
      {hideDetailHero ? null : (
        <div className={["detail-hero reveal", hideDetailIntroSections ? "no-media" : ""].filter(Boolean).join(" ")}>
          <div>
            {hideDetailEyebrow ? null : <span className="eyebrow">{project.type}</span>}
            <h1>{project.detailTitle || project.title}</h1>
            {hideDetailDescription ? null : <p>{project.description}</p>}
            {hideDetailHeroCopy ? null : (
              <>
                <div className="tag-row large">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>
          {hideDetailIntroSections ? null : project.cover ? (
            <img src={project.cover} alt={project.title} />
          ) : (
            <div className="detail-placeholder">
              <span>{project.group}</span>
              <strong>{project.title}</strong>
            </div>
          )}
        </div>
      )}

      {!hideDetailIntroSections && (
        <>
          <section className="detail-meta">
            <div className="meta-block reveal">
              <span>{copy.common.projectType}</span>
              <p>{project.type}</p>
            </div>
            <div className="meta-block reveal">
              <span>{copy.common.role}</span>
              <p>{project.role}</p>
            </div>
            <div className="meta-block reveal">
              <span>{copy.common.result}</span>
              <p>{project.result}</p>
            </div>
          </section>

          <section className="detail-section">
            <SectionTitle title={copy.common.process} />
            <div className="mini-steps">
              {project.process.map((step, index) => (
                <div className="mini-step reveal" key={step}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {project.isLookbook && (
        <FilterTabs
          items={lookbookCategories}
          active={lookbookFilter}
          onChange={setLookbookFilter}
          language={language}
        />
      )}

      {projectVideos.length > 0 ? (
        <section className="detail-section">
          <SectionTitle title={copy.nav.video} />
          <div className="video-grid">
            {projectVideos.map((video) => (
              <VideoCard key={video.slug} video={video} />
            ))}
          </div>
        </section>
      ) : null}

      {project.isFashionModel ? (
        <section className="detail-section">
          <div className="fashion-model-section-stack">
            {fashionModelSections.map((section) => (
              <article className="fashion-model-section reveal" key={section.id}>
                <div className="fashion-model-section-heading">
                  <span>{section.enTitle}</span>
                  <h3>{section.title}</h3>
                </div>
                <div className="fashion-model-group-stack">
                  {section.groups.map((group) => (
                    <div className="fashion-model-group" key={group.id}>
                      <ImageGrid images={group.images} className="natural fashion-model-direct-grid" hoverLabel={language === "en" ? "View Look" : "查看造型"} />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : project.subSections?.length > 0 ? (
        <section className="detail-section">
          <SectionTitle title="视觉系列" intro="AI 服装视觉按品牌形象、Lookbook 系列与服装静物三个方向组织展示。" />
          <div className="fashion-series-stack">
            {project.subSections.map((section) => (
              <article className="fashion-series reveal" key={section.title}>
                <div className="fashion-series-copy">
                  <span>{section.number}</span>
                  <h3>{section.title}</h3>
                  <p>{section.description}</p>
                  <div className="tag-row">
                    {section.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <ImageGrid images={section.images} compact={section.number !== "02"} />
              </article>
            ))}
          </div>
        </section>
      ) : project.isLookbook && filteredLookbookGroups.length > 0 ? (
        <section className="detail-section">
          <LookbookGallery groups={filteredLookbookGroups} language={language} />
        </section>
      ) : project.isAccessoryLookbook ? (
        <section className="detail-section">
          <LookbookGallery groups={accessoryLookbookGroups} language={language} className="accessory-lookbook-grid" />
        </section>
      ) : project.jewelrySections?.length > 0 ? (
        <section className="detail-section">
          <div className="jewelry-section-stack">
            {project.jewelrySections.map((section) => (
              <article className="jewelry-section reveal" key={section.id}>
                <div className="jewelry-section-heading">
                  <span>{section.enTitle}</span>
                  <h3>{section.title}</h3>
                  {section.caption ? <p>{section.caption}</p> : null}
                </div>
                <ImageGrid
                  images={section.images}
                  className={`natural jewelry-section-grid jewelry-section-grid-${section.id}`}
                  hoverLabel={language === "en" ? "View Look" : "查看造型"}
                />
              </article>
            ))}
          </div>
        </section>
      ) : project.eventVisualSections?.length > 0 ? (
        <section className="detail-section">
          <div className="event-visual-section-stack">
            {project.eventVisualSections.map((section) => (
              <article className="event-visual-section reveal" key={section.id}>
                <div className="event-visual-section-heading">
                  <span>{section.enTitle}</span>
                  <h3>{section.title}</h3>
                </div>
                <ImageGrid
                  images={section.images}
                  className={["natural", "event-visual-grid", `event-visual-${section.layout}-grid`].join(" ")}
                  hoverLabel={language === "en" ? "View Look" : "查看造型"}
                />
              </article>
            ))}
          </div>
        </section>
      ) : project.loraSections?.length > 0 ? (
        <section className="detail-section">
          <div className="lora-section-stack">
            {project.loraSections.map((section) => (
              <article className="lora-section reveal" key={section.title}>
                <h3>{section.title}</h3>
                <ImageGrid images={[{ src: section.image, alt: section.title }]} className="natural lora-image-grid" />
              </article>
            ))}
          </div>
        </section>
      ) : project.productSections?.length > 0 ? (
        <section className="detail-section">
          <SectionTitle title={project.visualOutputTitle || copy.common.visualOutput} />
          <div className="product-visual-section-stack">
            {project.productSections.map((section) => (
              <article className="product-visual-section reveal" key={section.id}>
                <h3>{section.title}</h3>
                <ImageGrid
                  images={section.images}
                  className={["natural", `product-visual-${section.id}-grid`].join(" ")}
                />
              </article>
            ))}
          </div>
        </section>
      ) : gallery.length > 0 ? (
        <section className="detail-section">
          <SectionTitle title={project.visualOutputTitle || copy.common.visualOutput} />
          <ImageGrid
            images={gallery}
            compact={!project.isLookbook && !project.preserveImageRatio}
            className={project.preserveImageRatio ? "natural clothing-visual-grid" : ""}
          />
        </section>
      ) : (
        <section className="detail-section empty-detail reveal">
          <SectionTitle title={copy.common.visualOutput} />
          <p>当前项目为结构占位，后续补充素材后将在这里展示封面、过程图和最终效果。</p>
        </section>
      )}

      <Link className="button ghost" to="/#works">
        {copy.common.backToWorks}
      </Link>
    </article>
  );
}
