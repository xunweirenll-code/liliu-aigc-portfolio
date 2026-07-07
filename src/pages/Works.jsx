import React from "react";

import BackButton from "../components/BackButton.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { projectGroups, projects } from "../data/projects.js";

export default function Works({ copy, sectionId, embedded = false }) {
  const projectsBySlug = new Map(projects.map((project) => [project.slug, project]));

  return (
    <section id={sectionId} className={embedded ? "page-section anchor-section works-section" : "page-section page-top works-section"}>
      {!embedded && <BackButton />}
      <div className="work-groups">
        {projectGroups.map((group, groupIndex) => (
          <section className="work-group-section" id={group.id} key={group.id}>
            <div className="work-group-heading reveal">
              <h2>
                <span className="work-group-number">{group.number}</span>
                {group.title}
              </h2>
            </div>

            <div className="work-category-stack">
              {group.categories.map((category) => {
                const categoryProjects = category.projectSlugs
                  .map((slug) => projectsBySlug.get(slug))
                  .filter((project) => project && !project.hiddenInWorks);

                if (!categoryProjects.length) return null;

                return (
                  <section className="work-category" key={category.id}>
                    <div className="project-grid compact">
                      {categoryProjects.map((project) => (
                        <ProjectCard key={project.slug} project={project} copy={copy} priority={groupIndex === 0} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
