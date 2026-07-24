import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LoadingImage from "./LoadingImage.jsx";
import { protectedImageProps, protectedMediaSurfaceProps } from "../utils/mediaProtection.js";

const imageSource = (image) => (typeof image === "string" ? image : image.src);
const imageAlt = (image) => (typeof image === "string" ? "AI portfolio visual" : image.alt);
const imageCaption = (image) => (typeof image === "string" ? "" : image.caption);

export default function ImageGrid({ images, compact = false, className = "", hoverLabel }) {
  const [previewIndex, setPreviewIndex] = useState(null);
  const gridClassName = ["image-grid", compact ? "compact" : "", className].filter(Boolean).join(" ");
  const previewImage = previewIndex === null ? null : images[previewIndex];
  const previewSrc = previewImage ? imageSource(previewImage) : null;
  const previewAlt = previewImage ? imageAlt(previewImage) : "Preview";

  const closePreview = () => setPreviewIndex(null);
  const showPrevious = () => {
    setPreviewIndex((index) => (index === null ? index : (index - 1 + images.length) % images.length));
  };
  const showNext = () => {
    setPreviewIndex((index) => (index === null ? index : (index + 1) % images.length));
  };

  useEffect(() => {
    if (previewIndex === null) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closePreview();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [previewIndex, images.length]);

  return (
    <>
      <div className={gridClassName}>
        {images.map((image, index) => {
          const src = imageSource(image);
          const caption = imageCaption(image);
          const tile = (
            <button
              {...protectedMediaSurfaceProps}
              className={["image-tile", caption ? "" : "reveal", hoverLabel ? "has-hint" : ""].filter(Boolean).join(" ")}
              key={`${src}-${index}`}
              type="button"
              onClick={() => setPreviewIndex(index)}
            >
              <LoadingImage src={src} alt={imageAlt(image)} loading={index < 2 ? "eager" : "lazy"} fetchPriority={index < 2 ? "high" : "auto"} />
              {hoverLabel && <span className="image-tile-hint">{hoverLabel}</span>}
            </button>
          );

          if (!caption) return tile;

          return (
            <figure className="image-grid-item has-caption reveal" key={`${src}-${index}`}>
              {tile}
              <figcaption>{caption}</figcaption>
            </figure>
          );
        })}
      </div>
      {previewSrc &&
        createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={previewAlt} {...protectedMediaSurfaceProps}>
          <button className="lightbox-backdrop" type="button" aria-label="关闭" onClick={closePreview} />
          <button className="lightbox-nav previous" type="button" aria-label="上一张" onClick={showPrevious}>
            ‹
          </button>
          <figure className="lightbox-frame" {...protectedMediaSurfaceProps}>
            <img {...protectedImageProps} src={previewSrc} alt={previewAlt} />
          </figure>
          <button className="lightbox-nav next" type="button" aria-label="下一张" onClick={showNext}>
            ›
          </button>
          <button className="lightbox-close" type="button" aria-label="关闭" onClick={closePreview}>
            ×
          </button>
        </div>,
          document.body,
        )}
    </>
  );
}
