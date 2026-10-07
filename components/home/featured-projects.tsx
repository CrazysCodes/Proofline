import Link from "next/link";
import { ProjectCard } from "@/components/content/project-card";
import { SectionHeader } from "@/components/ui/badges";
import type { ProjectEntry } from "@/lib/content/types";
import { ScrollWork } from "./scroll-work";

// Curated from the published portfolio; Markdown retains the full stories.
const showcase = [
  { name: "抖抖先知", type: "开源项目与小程序", description: "关注主播、检测开播、微信提醒，把日常需求做成可用的小产品。", image: "douyin-watch-home.png", contain: true, width: 0, height: 0, href: "/projects/douyin-live-alert", action: "抖抖先知 · 开源项目与小程序" },
  { name: "OpenCLI", type: "开源贡献", description: "贡献 HLTV 适配器，让电竞数据成为可组合的命令行能力，并沉淀 hltv-analyst Skill。", image: "", width: 0, height: 0, href: "/writing/opencli-hltv-contribution", action: "OpenCLI · 开源贡献" },
  { name: "Proofline", type: "开源个人主页", description: "以 Markdown 组织文章、作品和研究，让个人实践拥有一个持续生长的公开入口。", image: "proofline-home.png", width: 2033, height: 976, href: "/projects/proofline", action: "Proofline · 开源个人主页" },
];

export function FeaturedProjects({ projects, hasPortfolio }: { projects: ProjectEntry[]; hasPortfolio: boolean }) {
  if (!hasPortfolio) {
    const featured = projects.filter((project) => project.featured).slice(0, 3);
    return featured.length ? <section className="container home-section"><SectionHeader title="精选作品" href="/projects" action="全部作品 →" /><div className="two-col">{featured.map(project => <ProjectCard key={project.slug} project={project} />)}</div></section> : null;
  }
  return (
    <section className="container home-section">
      <SectionHeader title="精选作品" href="/writing/portfolio-showcase-2026" action="完整作品集 →" />
      <p className="section-intro">真实需求，小步构建，持续打磨。</p>
      <ScrollWork items={showcase} />
      <div className="showcase-more"><span>更多实践与贡献</span><Link href="/projects/NoteHealth">NoteHealth · 已归档 ↗</Link><Link href="/projects/ShipReadme">ShipReadme · 已归档 ↗</Link></div>
    </section>
  );
}
