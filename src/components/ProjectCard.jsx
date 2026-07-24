import React, { useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import LoadingImage from "./LoadingImage.jsx";
import ProtectedVideoPlayer from "./ProtectedVideoPlayer.jsx";
import useProtectedVideoSource from "../hooks/useProtectedVideoSource.js";
import { protectedMediaSurfaceProps, protectedVideoProps } from "../utils/mediaProtection.js";

const WORKS_RETURN_KEY = "portfolio:worksReturn";
const PREVIEW_VOLUME = 0.28;

export default function ProjectCard({ project, copy, priority = false }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [canHoverPreview, setCanHoverPreview] = useState(false);
  const [hoverVideoReady, setHoverVideoReady] = useState(false);
  const hoverVideoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const location = useLocation();
  const primaryVideo = project.videos?.[0];
  const isVideoProject = project.group === "commercial-video" && primaryVideo;
  const displayTitle = project.cardTitle || project.title;
  const protectedPrimaryVideo = useProtectedVideoSource(isVideoProject && canHoverPreview ? primaryVideo : "");
  const returnTo = location.pathname === "/" ? "/#works" : `${location.pathname}${location.search}${location.hash}`;

  const rememberReturnPosition = (event) => {
    const cardTop = event.currentTarget.getBoundingClientRect().top;
    window.sessionStorage.setItem(
      WORKS_RETURN_KEY,
      JSON.stringify({
        returnTo,
        slug: project.slug,
        scrollY: window.scrollY,
        cardTop,
      }),
    );
  };

  const playHoverPreview = () => {
    const video = hoverVideoRef.current;
    if (!video || !protectedPrimaryVideo) return;

    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const stopHoverPreview = () => {
    const video = hoverVideoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    video.load();
  };

  const closePreview = () => {
    const video = previewVideoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setPreviewOpen(false);
  };

  const openPreview = () => {
    flushSync(() => setPreviewOpen(true));

    const video = previewVideoRef.current;
    if (video) {
      video.muted = false;
      video.defaultMuted = false;
      video.volume = PREVIEW_VOLUME;
      video.play().catch(() => {});
    }
  };

  useEffect(() => {
    setHoverVideoReady(false);
  }, [protectedPrimaryVideo]);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(hover: hover) and (pointer: fine)");
    if (!mediaQuery) return undefined;

    const updateHoverPreview = () => setCanHoverPreview(mediaQuery.matches);
    updateHoverPreview();
    mediaQuery.addEventListener?.("change", updateHoverPreview);
    return () => mediaQuery.removeEventListener?.("change", updateHoverPreview);
  }, []);

  useEffect(() => {
    if (!previewOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closePreview();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [previewOpen]);

  if (isVideoProject) {
    return (
      <>
        <button
          id={`project-card-${project.slug}`}
          className="project-card project-video-card reveal"
          type="button"
          onMouseEnter={playHoverPreview}
          onMouseLeave={stopHoverPreview}
          onFocus={playHoverPreview}
          onBlur={stopHoverPreview}
          onClick={openPreview}
        >
          <figure {...protectedMediaSurfaceProps}>
            {canHoverPreview ? (
              <>
                {!hoverVideoReady && <span className="image-loading-indicator" aria-hidden="true" />}
                <video
                  {...protectedVideoProps}
                  ref={hoverVideoRef}
                  src={protectedPrimaryVideo || undefined}
                  poster={project.cover}
                  muted
                  playsInline
                  preload={priority ? "auto" : "metadata"}
                  loop
                  className={hoverVideoReady ? "is-loaded" : "is-loading"}
                  onLoadedData={() => setHoverVideoReady(true)}
                  onError={() => setHoverVideoReady(true)}
                  style={project.coverPosition ? { objectPosition: project.coverPosition } : undefined}
                />
              </>
            ) : (
              <LoadingImage
                src={project.cover}
                alt={displayTitle}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                style={project.coverPosition ? { objectPosition: project.coverPosition } : undefined}
              />
            )}
            <span className="project-hover-icon" aria-hidden="true" />
          </figure>
          <div className="card-copy">
            <div className="card-title-row">
              <h3>{displayTitle}</h3>
            </div>
            <div className="tag-row">
              {project.tags.slice(0, 2).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </button>

        {createPortal(
            <div
              className={["video-preview-lightbox", previewOpen ? "is-open" : "is-closed"].join(" ")}
              role="dialog"
              aria-modal="true"
              aria-hidden={!previewOpen}
              aria-label={displayTitle}
              inert={previewOpen ? undefined : ""}
              {...protectedMediaSurfaceProps}
            >
              <button className="video-preview-backdrop" type="button" aria-label="关闭" onClick={closePreview} />
              <div className="video-preview-frame" {...protectedMediaSurfaceProps}>
                <ProtectedVideoPlayer
                  ref={previewVideoRef}
                  src={primaryVideo}
                  poster={project.cover}
                  autoPlay={previewOpen}
                  preload="metadata"
                  volume={PREVIEW_VOLUME}
                  className="video-preview-player"
                />
              </div>
              <button className="video-preview-close" type="button" aria-label="关闭" onClick={closePreview}>
                ×
              </button>
            </div>,
            document.body,
          )}
      </>
    );
  }

  return (
    <Link
      id={`project-card-${project.slug}`}
      className="project-card reveal"
      to={`/works/${project.slug}`}
      state={{ returnTo }}
      onClick={rememberReturnPosition}
    >
      <figure {...protectedMediaSurfaceProps}>
        {project.cover ? (
          <LoadingImage
            src={project.cover}
            alt={displayTitle}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            style={project.coverPosition ? { objectPosition: project.coverPosition } : undefined}
          />
        ) : (
          <div className="project-placeholder">
            <span>Case in Progress</span>
            <strong>Coming Soon</strong>
          </div>
        )}
        <span className="project-hover-icon" aria-hidden="true" />
      </figure>
      <div className="card-copy">
        <div className="card-title-row">
          <h3>{displayTitle}</h3>
        </div>
        <div className="tag-row">
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
