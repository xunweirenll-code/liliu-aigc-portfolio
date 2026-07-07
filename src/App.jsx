import React, { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Works from "./pages/Works.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Video from "./pages/Video.jsx";
import Workflow from "./pages/Workflow.jsx";
import Process from "./pages/Process.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import { i18n } from "./data/i18n.js";
import { shouldProtectMediaEvent } from "./utils/mediaProtection.js";

const WORKS_RETURN_KEY = "portfolio:worksReturn";
const BUILD_VERSION = "20260706-cache-bust-1";

export default function App() {
  const [language, setLanguage] = useState("zh");
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();
  const copy = useMemo(() => i18n[language], [language]);

  useEffect(() => {
    const currentReturnTo = `${location.pathname}${location.search}${location.hash}`;
    const canRestoreStoredReturn = (location.pathname === "/" && location.hash === "#works") || location.pathname === "/works";

    const restoreStoredReturnPosition = () => {
      const storedReturn = window.sessionStorage.getItem(WORKS_RETURN_KEY);
      if (!storedReturn) return false;

      let parsedReturn;
      try {
        parsedReturn = JSON.parse(storedReturn);
      } catch {
        window.sessionStorage.removeItem(WORKS_RETURN_KEY);
        return false;
      }

      if (parsedReturn.returnTo && parsedReturn.returnTo !== currentReturnTo) {
        return false;
      }

      const restoreReturnPosition = () => {
        const { slug, scrollY, cardTop } = parsedReturn;
        const card = document.getElementById(`project-card-${slug}`);

        if (card && Number.isFinite(cardTop)) {
          const cardDocumentTop = window.scrollY + card.getBoundingClientRect().top;
          window.scrollTo({ top: Math.max(0, cardDocumentTop - cardTop), left: 0, behavior: "auto" });
          return;
        }

        if (Number.isFinite(scrollY)) {
          window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
          return;
        }

        if (location.pathname === "/" && location.hash === "#works") {
          document.getElementById("works")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      window.setTimeout(restoreReturnPosition, 0);
      window.setTimeout(() => {
        restoreReturnPosition();
        window.sessionStorage.removeItem(WORKS_RETURN_KEY);
      }, 150);
      return true;
    };

    if (location.pathname !== "/") {
      setActiveSection(location.hash ? location.hash.slice(1) : "");

      if (canRestoreStoredReturn && restoreStoredReturnPosition()) {
        return;
      }

      window.setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }, 0);
      return;
    }

    if (location.hash === "#works") {
      if (restoreStoredReturnPosition()) {
        return;
      }
    }

    const targetId = location.hash ? location.hash.slice(1) : "hero";
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    if (location.pathname !== "/") return undefined;

    const sectionIds = ["hero", "about", "works", "process", "contact"];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0.12, 0.25, 0.45, 0.65],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const protectMedia = (event) => {
      if (shouldProtectMediaEvent(event)) {
        event.preventDefault();
      }
    };

    const preventSaveShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
      }
    };

    const protectedEventOptions = { capture: true };

    document.addEventListener("contextmenu", protectMedia, protectedEventOptions);
    document.addEventListener("dragstart", protectMedia, protectedEventOptions);
    document.addEventListener("selectstart", protectMedia, protectedEventOptions);
    document.addEventListener("beforecopy", protectMedia, protectedEventOptions);
    document.addEventListener("beforecut", protectMedia, protectedEventOptions);
    document.addEventListener("copy", protectMedia, protectedEventOptions);
    document.addEventListener("cut", protectMedia, protectedEventOptions);
    window.addEventListener("keydown", preventSaveShortcut);

    return () => {
      document.removeEventListener("contextmenu", protectMedia, protectedEventOptions);
      document.removeEventListener("dragstart", protectMedia, protectedEventOptions);
      document.removeEventListener("selectstart", protectMedia, protectedEventOptions);
      document.removeEventListener("beforecopy", protectMedia, protectedEventOptions);
      document.removeEventListener("beforecut", protectMedia, protectedEventOptions);
      document.removeEventListener("copy", protectMedia, protectedEventOptions);
      document.removeEventListener("cut", protectMedia, protectedEventOptions);
      window.removeEventListener("keydown", preventSaveShortcut);
    };
  }, []);

  return (
    <div className="site-shell" data-build-version={BUILD_VERSION}>
      <Header language={language} setLanguage={setLanguage} copy={copy} activeSection={activeSection} />
      <main>
        <Routes>
          <Route path="/" element={<Home copy={copy} language={language} />} />
          <Route path="/works" element={<Works copy={copy} language={language} />} />
          <Route path="/works/:slug" element={<ProjectDetail copy={copy} language={language} />} />
          <Route path="/video" element={<Video copy={copy} language={language} />} />
          <Route path="/workflow" element={<Workflow copy={copy} language={language} />} />
          <Route path="/process" element={<Process copy={copy} language={language} />} />
          <Route path="/about" element={<About copy={copy} language={language} />} />
          <Route path="/contact" element={<Contact copy={copy} language={language} />} />
        </Routes>
      </main>
      <Footer copy={copy} />
    </div>
  );
}
