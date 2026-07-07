import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { protectedVideoProps } from "../utils/mediaProtection.js";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const getProgress = (currentTime, duration) => {
  if (!duration) return 0;
  return Math.min(100, Math.max(0, (currentTime / duration) * 100));
};

const ProtectedVideoPlayer = forwardRef(function ProtectedVideoPlayer(
  {
    autoPlay = false,
    className = "",
    loop = false,
    muted = false,
    poster,
    preload = "metadata",
    src,
  },
  ref,
) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isPlaying, setIsPlaying] = useState(false);

  useImperativeHandle(ref, () => videoRef.current);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.muted = muted;
    setIsMuted(muted);

    if (autoPlay) {
      video.play().catch(() => {});
    }

    return undefined;
  }, [autoPlay, muted, src]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const updateTime = () => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);
    setDuration(video.duration || 0);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      return;
    }

    video.pause();
  };

  const seek = (event) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const nextProgress = Number(event.target.value);
    video.currentTime = (nextProgress / 100) * duration;
    setCurrentTime(video.currentTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }

    container.requestFullscreen?.();
  };

  const progress = getProgress(currentTime, duration);

  return (
    <div className={["protected-video-player", className].filter(Boolean).join(" ")} ref={containerRef}>
      <video
        {...protectedVideoProps}
        src={src}
        poster={poster}
        playsInline
        preload={preload}
        loop={loop}
        muted={muted}
        ref={videoRef}
        onClick={togglePlay}
        onDurationChange={updateTime}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={updateTime}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={updateTime}
      />
      <div className="protected-video-controls">
        <button className="protected-video-button" type="button" aria-label={isPlaying ? "暂停" : "播放"} onClick={togglePlay}>
          {isPlaying ? "Ⅱ" : "▶"}
        </button>
        <span className="protected-video-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <input
          className="protected-video-progress"
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          aria-label="播放进度"
          onChange={seek}
        />
        <button className="protected-video-button" type="button" aria-label={isMuted ? "取消静音" : "静音"} onClick={toggleMute}>
          {isMuted ? "Muted" : "Vol"}
        </button>
        <button className="protected-video-button" type="button" aria-label={isFullscreen ? "退出全屏" : "全屏"} onClick={toggleFullscreen}>
          ⛶
        </button>
      </div>
    </div>
  );
});

export default ProtectedVideoPlayer;
