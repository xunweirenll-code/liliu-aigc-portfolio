import React from "react";
import ProtectedVideoPlayer from "./ProtectedVideoPlayer.jsx";

export default function VideoCard({ video }) {
  return (
    <article className="video-card reveal">
      <ProtectedVideoPlayer src={video.src} poster={video.poster} muted preload="metadata" />
      <div className="card-copy">
        <span className="card-type">{video.type}</span>
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </div>
    </article>
  );
}
