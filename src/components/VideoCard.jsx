export default function VideoCard({ video }) {
  return (
    <article className="video-card reveal">
      <video src={video.src} poster={video.poster} controls muted playsInline preload="metadata" />
      <div className="card-copy">
        <span className="card-type">{video.type}</span>
        <h3>{video.title}</h3>
        <p>{video.description}</p>
      </div>
    </article>
  );
}
