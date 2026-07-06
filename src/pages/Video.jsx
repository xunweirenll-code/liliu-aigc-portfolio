import SectionTitle from "../components/SectionTitle.jsx";
import VideoCard from "../components/VideoCard.jsx";
import { videos } from "../data/videos.js";

export default function Video({ copy, sectionId, embedded = false }) {
  return (
    <section id={sectionId} className={embedded ? "page-section anchor-section" : "page-section page-top"}>
      <SectionTitle title={copy.pages.videoTitle} intro={copy.pages.videoIntro} />
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video.slug} video={video} />
        ))}
      </div>
    </section>
  );
}
