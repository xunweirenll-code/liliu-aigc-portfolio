import React, { useState } from "react";
import { protectedImageProps } from "../utils/mediaProtection.js";

export default function LoadingImage({
  alt,
  className = "",
  decoding = "async",
  fetchPriority,
  loading = "lazy",
  onError,
  onLoad,
  src,
  style,
}) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = (event) => {
    setLoaded(true);
    onLoad?.(event);
  };

  const handleError = (event) => {
    setLoaded(true);
    onError?.(event);
  };

  return (
    <>
      {!loaded && <span className="image-loading-indicator" aria-hidden="true" />}
      <img
        {...protectedImageProps}
        className={[className, loaded ? "is-loaded" : "is-loading"].filter(Boolean).join(" ")}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
}
