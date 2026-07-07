import React from "react";

import BackButton from "../components/BackButton.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { protectedImageProps } from "../utils/mediaProtection.js";

export default function Process({ copy, sectionId, embedded = false }) {
  return (
    <section id={sectionId} className={embedded ? "page-section anchor-section" : "page-section page-top"}>
      {!embedded && <BackButton />}
      <SectionTitle title={copy.pages.processTitle} intro={copy.pages.processIntro} />
      <figure className="process-visual reveal">
        <img {...protectedImageProps} src="/assets/images/liucheng/liucheng.png" alt="创作流程图" loading="lazy" />
      </figure>
    </section>
  );
}
