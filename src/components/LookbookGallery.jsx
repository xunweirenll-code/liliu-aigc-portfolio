import React, { useEffect, useMemo, useState } from "react";
import LoadingImage from "./LoadingImage.jsx";

const languageText = {
  zh: {
    viewLook: "查看造型",
    close: "关闭",
    previous: "上一张",
    next: "下一张",
    thumbnail: "切换到",
  },
  en: {
    viewLook: "View Look",
    close: "Close",
    previous: "Previous",
    next: "Next",
    thumbnail: "Show",
  },
};

export default function LookbookGallery({ groups, language = "zh", className = "" }) {
  const copy = languageText[language] || languageText.zh;
  const [activeGroupIndex, setActiveGroupIndex] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [cardImageIndexes, setCardImageIndexes] = useState({});
  const activeGroup = activeGroupIndex === null ? null : groups[activeGroupIndex];
  const imageCount = activeGroup?.images.length || 0;

  const openGroup = (groupIndex, imageIndex = 0) => {
    setActiveGroupIndex(groupIndex);
    setActiveImageIndex(imageIndex);
  };

  const closeLightbox = () => {
    setActiveGroupIndex(null);
    setActiveImageIndex(0);
  };

  const showPrevious = () => {
    if (!imageCount) return;
    setActiveImageIndex((index) => (index - 1 + imageCount) % imageCount);
  };

  const showNext = () => {
    if (!imageCount) return;
    setActiveImageIndex((index) => (index + 1) % imageCount);
  };

  useEffect(() => {
    if (!activeGroup) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeGroup, imageCount]);

  const activeImage = useMemo(() => {
    if (!activeGroup) return null;
    return activeGroup.images[activeImageIndex];
  }, [activeGroup, activeImageIndex]);

  return (
    <>
      <div className={["lookbook-grid", className].filter(Boolean).join(" ")}>
        {groups.map((group, groupIndex) => {
          const selectedImageIndex = cardImageIndexes[group.id] || 0;
          const selectedImage = group.images[selectedImageIndex] || group.cover;
          const dotImages = group.images.slice(0, 4);

          return (
            <article className="lookbook-card reveal" key={group.id}>
              <button
                className="lookbook-card-preview"
                type="button"
                aria-label={`${language === "en" ? group.enTitle : group.title} ${copy.viewLook}`}
                onClick={() => openGroup(groupIndex, selectedImageIndex)}
              >
                <figure>
                  <LoadingImage className="lookbook-cover-image" src={selectedImage.src} alt={selectedImage.alt} loading={groupIndex < 2 ? "eager" : "lazy"} fetchPriority={groupIndex < 2 ? "high" : "auto"} />
                  <span aria-hidden="true">{copy.viewLook}</span>
                </figure>
              </button>
              <div className="lookbook-card-dots" aria-label="Lookbook preview images">
                {dotImages.map((image, imageIndex) => (
                  <button
                    className={imageIndex === selectedImageIndex ? "active" : undefined}
                    key={image.id}
                    type="button"
                    aria-label={`${copy.thumbnail} ${imageIndex + 1}`}
                    onClick={() =>
                      setCardImageIndexes((current) => ({
                        ...current,
                        [group.id]: imageIndex,
                      }))
                    }
                  />
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {activeGroup && activeImage && (
        <div
          className={["lookbook-lightbox", className ? `${className}-lightbox` : ""].filter(Boolean).join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label={activeGroup.title}
        >
          <button className="lookbook-lightbox-backdrop" type="button" aria-label={copy.close} onClick={closeLightbox} />
          <div className="lookbook-lightbox-panel">
            <div className="lookbook-lightbox-top">
              <div>
                <strong>{language === "en" ? activeGroup.enTitle : activeGroup.title}</strong>
                <span>
                  {activeImageIndex + 1} / {imageCount}
                </span>
              </div>
              <button className="lookbook-close" type="button" aria-label={copy.close} onClick={closeLightbox}>
                ×
              </button>
            </div>

            <div className="lookbook-stage">
              <button className="lookbook-nav previous" type="button" aria-label={copy.previous} onClick={showPrevious}>
                ‹
              </button>
              <figure>
                <img src={activeImage.src} alt={activeImage.alt} />
                <figcaption>
                  <span>{activeImageIndex + 1} / {imageCount}</span>
                  <strong>{language === "en" ? activeImage.enViewLabel : activeImage.viewLabel}</strong>
                </figcaption>
              </figure>
              <button className="lookbook-nav next" type="button" aria-label={copy.next} onClick={showNext}>
                ›
              </button>
            </div>

            <div className="lookbook-thumbnails" aria-label="Lookbook thumbnails">
              {activeGroup.images.map((image, imageIndex) => (
                <button
                  className={imageIndex === activeImageIndex ? "active" : undefined}
                  key={image.id}
                  type="button"
                  aria-label={`${copy.thumbnail} ${language === "en" ? image.enViewLabel : image.viewLabel}`}
                  onClick={() => setActiveImageIndex(imageIndex)}
                >
                  <img src={image.src} alt={image.alt} />
                  <span>{language === "en" ? image.enViewLabel : image.viewLabel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
