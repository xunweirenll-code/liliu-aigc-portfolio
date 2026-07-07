export const protectedMediaSelector = "img, video, [data-protected-media='true']";
export const downloadAllowedSelector = "a[download], [data-allow-download='true']";

export const preventProtectedMediaEvent = (event) => {
  event.preventDefault();
};

export const protectedImageProps = {
  "data-protected-media": "true",
  draggable: false,
  onContextMenu: preventProtectedMediaEvent,
  onCopy: preventProtectedMediaEvent,
  onCut: preventProtectedMediaEvent,
  onDragStart: preventProtectedMediaEvent,
};

export const protectedVideoProps = {
  ...protectedImageProps,
  controlsList: "nodownload noremoteplayback",
  disablePictureInPicture: true,
  disableRemotePlayback: true,
};

const selectionContainsProtectedMedia = () => {
  const selection = window.getSelection?.();
  if (!selection || selection.rangeCount === 0) return false;

  for (let index = 0; index < selection.rangeCount; index += 1) {
    const fragment = selection.getRangeAt(index).cloneContents();
    if (fragment.querySelector?.(protectedMediaSelector)) return true;
  }

  return false;
};

export const shouldProtectMediaEvent = (event) => {
  if (event.target?.closest?.(downloadAllowedSelector)) return false;
  if (event.target?.closest?.(protectedMediaSelector)) return true;
  if (event.type === "copy" || event.type === "cut") return selectionContainsProtectedMedia();
  return false;
};
