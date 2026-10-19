import Link from "next/link";
import { SectionHeader } from "@/components/ui/badges";
import type { ProjectEntry } from "@/lib/content/types";
import { ScrollWork } from "./scroll-work";

export function FeaturedProjects({projects, hasPortfolio}: {projects: ProjectEntry[]; hasPortfolio: boolean}) {
  const selected = projects.filter(project => project.featured);
  const items = selected.map(project => ({name: project.name, type: project.status, description: project.description, image: "", width: 0, height: 0, href: "/projects/" + project.slug, action: "查看项目介绍"}));
  const other = projects.filter(project => !project.featured);
  if (!items.length) return null;
  return <section className="container home-section"><SectionHeader title="精选作品" href={hasPortfolio ? "/writing/portfolio-overview" : "/projects"} action="完整作品集 →" /><p className="section-intro">真实需求，小步构建，持续打磨。</p><ScrollWork items={items} />{other.length ? <div className="showcase-more"><span>更多实践与贡献</span>{other.map(project => <Link key={project.slug} href={"/projects/" + project.slug}>{project.name} ↗</Link>)}</div> : null}</section>;
}
