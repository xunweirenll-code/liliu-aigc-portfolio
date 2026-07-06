import React, { useEffect, useMemo, useRef, useState } from "react";
import { previewImages } from "../data/previewImages.js";
import "./PreviewImageFlow.css";

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const lerp = (start, end, progress) => start + (end - start) * progress;
const smoothstep = (edge0, edge1, value) => {
  const progress = clamp((value - edge0) / (edge1 - edge0));
  return progress * progress * (3 - 2 * progress);
};
const wrap = (value, min, max) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

const getImageLimit = () => {
  if (typeof window === "undefined") return previewImages.length;
  if (window.innerWidth < 768) return 20;
  if (window.innerWidth <= 1080) return 34;
  return previewImages.length;
};

const mobileSlots = [
  { x: -32, y: 28, width: 82, rotation: -2.1 },
  { x: 4, y: 92, width: 88, rotation: 1.5 },
  { x: 31, y: 48, width: 78, rotation: -1.1 },
  { x: -18, y: 280, width: 92, rotation: 2 },
  { x: 28, y: 350, width: 84, rotation: -1.5 },
  { x: 6, y: 560, width: 88, rotation: 1.1 },
  { x: -31, y: 720, width: 80, rotation: -1.8 },
  { x: 24, y: 770, width: 94, rotation: 1.8 },
  { x: -4, y: 950, width: 86, rotation: -0.9 },
  { x: 32, y: 1030, width: 80, rotation: 1.6 },
  { x: -27, y: 1090, width: 90, rotation: -2 },
  { x: -32, y: 1300, width: 82, rotation: 1.4 },
  { x: 1, y: 1420, width: 88, rotation: -1.2 },
  { x: 30, y: 1600, width: 84, rotation: 1.9 },
  { x: -22, y: 1670, width: 92, rotation: -1.4 },
  { x: 10, y: 1745, width: 80, rotation: 0.8 },
  { x: 32, y: 1920, width: 86, rotation: -1.9 },
  { x: -30, y: 1970, width: 88, rotation: 1.2 },
  { x: 0, y: 2140, width: 82, rotation: -1.6 },
  { x: 25, y: 2280, width: 90, rotation: 1.4 },
];

const getFrameImage = (image, index, isMobile) => {
  if (!isMobile) return image;

  const slot = mobileSlots[index % mobileSlots.length];

  return {
    ...image,
    x: `${slot.x}vw`,
    y: slot.y,
    width: slot.width,
    rotation: slot.rotation,
    speed: 1,
  };
};

export default function PreviewImageFlow() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const flowOffsetRef = useRef(0);
  const currentSpeedRef = useRef(0);
  const scrollBoostRef = useRef(0);
  const targetBoostRef = useRef(0);
  const lastScrollYRef = useRef(typeof window === "undefined" ? 0 : window.scrollY);
  const lastTimeRef = useRef(0);
  const [imageLimit, setImageLimit] = useState(getImageLimit);
  const images = useMemo(() => previewImages.slice(0, imageLimit), [imageLimit]);

  useEffect(() => {
    const updateImageLimit = () => setImageLimit(getImageLimit());

    updateImageLimit();
    window.addEventListener("resize", updateImageLimit, { passive: true });

    return () => window.removeEventListener("resize", updateImageLimit);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const isMobile = window.innerWidth < 768;
    const frameImages = images.map((image, index) => getFrameImage(image, index, isMobile));
    const maxFrameY = Math.max(...frameImages.map((image) => image.y));
    const baseSpeed = isMobile ? 102 : window.innerWidth <= 1080 ? 70 : 92;
    const scrollMultiplier = isMobile ? 0.22 : 0.36;
    const wheelMultiplier = isMobile ? 0.26 : 0.46;

    const setCardFrame = (card, image, screenY, opacity, scale) => {
      card.style.opacity = String(opacity);
      card.style.transform = `translate3d(-50%, ${screenY}px, 0) translate3d(${image.x}, 0, 0) rotate(${image.rotation}deg) scale(${scale})`;
    };

    const getNormalizedWheelDelta = (event) => {
      if (event.deltaMode === 1) return event.deltaY * 16;
      if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
      return event.deltaY;
    };

    const renderStaticWall = () => {
      cardRefs.current.forEach((card, index) => {
        const image = frameImages[index];
        if (!card || !image) return;

        const staticY = 76 + (index % 8) * 68 + Math.floor(index / 8) * 18;
        setCardFrame(card, image, staticY, index % 4 === 0 ? 0.62 : 0.86, index % 3 === 0 ? 0.96 : 1);
      });
    };

    const render = (time = 0) => {
      if (reduceMotion.matches) {
        renderStaticWall();
        return undefined;
      }

      const previousTime = lastTimeRef.current || time;
      const deltaTime = clamp((time - previousTime) / 1000, 0, 0.05);
      lastTimeRef.current = time;

      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      if (scrollDelta !== 0) {
        targetBoostRef.current = clamp(targetBoostRef.current + scrollDelta * scrollMultiplier, -110, 280);
      }

      scrollBoostRef.current = lerp(scrollBoostRef.current, targetBoostRef.current, 0.24);
      targetBoostRef.current = lerp(targetBoostRef.current, 0, 0.06);
      const targetSpeed = clamp(baseSpeed + scrollBoostRef.current, baseSpeed * 0.9, baseSpeed + 360);
      currentSpeedRef.current = lerp(currentSpeedRef.current || baseSpeed, targetSpeed, 0.2);
      flowOffsetRef.current += currentSpeedRef.current * deltaTime;

      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const extraHeight = Math.max(isMobile ? 220 : 160, viewportHeight * (isMobile ? 0.34 : 0.26));
      const loopHeight = Math.max(viewportHeight + extraHeight * 2, maxFrameY + extraHeight + 120);

      cardRefs.current.forEach((card, index) => {
        const image = frameImages[index];
        if (!card || !image) return;

        const rawY = image.y - flowOffsetRef.current * image.speed;
        const screenY = wrap(rawY, -extraHeight, loopHeight - extraHeight);
        const distanceToEdge = Math.min(screenY, viewportHeight - screenY);
        const fadeZone = viewportHeight * (isMobile ? 0.32 : 0.22);
        const edgeProgress = clamp(distanceToEdge / fadeZone);
        const easedEdge = smoothstep(0, 1, edgeProgress);
        const opacity = clamp(lerp(0, isMobile ? 0.82 : 0.98, easedEdge), 0, isMobile ? 0.82 : 0.98);
        const scale = lerp(isMobile ? 0.86 : 0.98, isMobile ? 1 : 1.02, easedEdge);

        setCardFrame(card, image, screenY, opacity, scale);
      });

      frame = window.requestAnimationFrame(render);
      return undefined;
    };

    const handleWheel = (event) => {
      const wheelDelta = getNormalizedWheelDelta(event);
      targetBoostRef.current = clamp(targetBoostRef.current + wheelDelta * wheelMultiplier, -160, 420);
    };

    currentSpeedRef.current = baseSpeed;
    scrollBoostRef.current = 0;
    targetBoostRef.current = 0;
    lastScrollYRef.current = window.scrollY;
    frame = window.requestAnimationFrame(render);
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [images]);

  return (
    <section className="preview-image-flow" aria-label="AIGC visual works preview" ref={sectionRef}>
      <div className="preview-image-flow-title">
        <span>/// VISUAL ARCHIVE ///</span>
        <h2>Selected AIGC Works</h2>
      </div>

      <div className="preview-image-flow-sticky">
        <div className="preview-image-flow-wall" aria-hidden="true">
          {images.map((image, index) => (
            <figure
              className="preview-flow-card"
              key={image.src}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              style={{
                "--flow-x": image.x,
                "--flow-screen-y": `${image.y}px`,
                "--flow-width": `${image.width}px`,
                "--flow-rotation": `${image.rotation}deg`,
                "--flow-opacity": 0,
                "--flow-scale": 0.98,
              }}
            >
              <img src={image.src} alt={image.alt} loading="lazy" decoding="async" draggable="false" />
              <figcaption>{image.category}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
