import { ProjectCard } from "@/components/content/project-card";
import { SectionHeader } from "@/components/ui/badges";
import type { ProjectEntry } from "@/lib/content/types";

export function FeaturedProjects({ projects }: { projects: ProjectEntry[] }) {
  const featured = projects.filter((project) => project.featured || project.status === "featured").slice(0, 3);
  const fallback = featured.length ? featured : projects.slice(0, 3);
  const [main, ...rest] = fallback;

  if (!main) return null;

  return (
    <section className="container" style={{ paddingTop: 56 }}>
      <SectionHeader title="Featured Projects" href="/projects" action="All projects →" />
      <div className="project-feature-grid">
        <div className="project-feature-main">
          <ProjectCard project={main} large />
        </div>
        {rest.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
