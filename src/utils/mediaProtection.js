export const protectedMediaSelector = "img, video, [data-protected-media='true'], [data-protected-media-surface='true']";
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

export const protectedMediaSurfaceProps = {
  "data-protected-media-surface": "true",
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
  controls: false,
  "webkit-playsinline": "true",
  "x5-playsinline": "true",
  "x5-video-player-type": "h5",
  "x5-video-player-fullscreen": "false",
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

const getEventPoint = (event) => {
  const touch = event.touches?.[0] || event.changedTouches?.[0];
  if (touch) return { x: touch.clientX, y: touch.clientY };
  if (Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
    return { x: event.clientX, y: event.clientY };
  }
  return null;
};

const pointContainsProtectedMedia = (event) => {
  const point = getEventPoint(event);
  if (!point || !document.elementsFromPoint) return false;

  return document.elementsFromPoint(point.x, point.y).some((element) => element.matches?.(protectedMediaSelector));
};

export const shouldProtectMediaEvent = (event) => {
  if (event.target?.closest?.(downloadAllowedSelector)) return false;
  if (event.target?.closest?.(protectedMediaSelector)) return true;
  if (event.type === "copy" || event.type === "cut" || event.type === "beforecopy" || event.type === "beforecut") {
    return selectionContainsProtectedMedia();
  }
  if (event.type === "contextmenu" || event.type === "dragstart" || event.type === "selectstart") {
    return pointContainsProtectedMedia(event);
  }
  return false;
};
