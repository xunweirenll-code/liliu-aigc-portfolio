import { Link } from "react-router-dom";
import About from "./About.jsx";
import Contact from "./Contact.jsx";
import Process from "./Process.jsx";
import PreviewImageFlow from "../components/PreviewImageFlow.jsx";
import Works from "./Works.jsx";
import WorksGallery from "./WorksGallery.jsx";

export default function Home({ copy }) {
  return (
    <>
      <section id="hero" className="hero page-section anchor-section">
        <div className="hero-copy reveal">
          <span className="eyebrow">{copy.home.eyebrow}</span>
          <h1>{copy.home.title}</h1>
          <div className="tag-row large">
            {copy.home.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="action-row">
            <Link className="button primary" to="/#works">
              {copy.nav.works}
            </Link>
            <Link className="button ghost" to="/#contact">
              {copy.nav.contact}
            </Link>
          </div>
        </div>
      </section>

      <About copy={copy} sectionId="about" embedded />
      <div id="works" className="work-showcase-section anchor-section">
        <PreviewImageFlow />
        <WorksGallery />
        <Works copy={copy} embedded />
      </div>
      <Process copy={copy} sectionId="process" embedded />
      <Contact copy={copy} sectionId="contact" embedded />
    </>
  );
}
