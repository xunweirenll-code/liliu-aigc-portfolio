import { useEffect, useState } from "react";

export default function useProtectedVideoSource(src) {
  const [protectedSrc, setProtectedSrc] = useState("");

  useEffect(() => {
    if (!src) {
      setProtectedSrc("");
      return undefined;
    }

    const controller = new AbortController();
    let objectUrl = "";

    setProtectedSrc("");

    fetch(src, {
      cache: "force-cache",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Video request failed: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(blob);
        setProtectedSrc(objectUrl);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setProtectedSrc("");
        }
      });

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return protectedSrc;
}
