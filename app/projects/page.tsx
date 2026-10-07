import type { Metadata } from "next";

import { ProjectCard } from "@/components/content/project-card";
import { statusConfig } from "@/components/ui/badges";
import { listProjects } from "@/lib/content/collections";
import type { ProjectStatus } from "@/lib/content/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "作品",
};

const statusOrder: ProjectStatus[] = ["open-source", "active", "building", "featured", "archived"];

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ status?: ProjectStatus }> }) {
  const params = await searchParams;
  const projects = await listProjects();
  const filtered = params.status ? projects.filter((project) => project.status === params.status) : projects;

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">
          作品
        </h1>
        <p style={{ fontSize: 14, color: "var(--foreground-secondary)", lineHeight: 1.6 }}>
          已上线的产品、研究原型与个人工具，在这里记录它们的构建过程。
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
        <FilterButton href="/projects" label="全部" active={!params.status} count={projects.length} />
        {statusOrder.map((status) => {
          const count = projects.filter((project) => project.status === status).length;
          if (!count) return null;
          return (
            <FilterButton
              key={status}
              href={params.status === status ? "/projects" : `/projects?status=${status}`}
              label={statusConfig[status].label}
              active={params.status === status}
              count={count}
              dotColor={statusConfig[status].dot}
            />
          );
        })}
      </div>

      <div className="two-col">{filtered.map(project => <ProjectCard key={project.slug} project={project} />)}</div>
    </div>
  );
}

function FilterButton({
  href,
  label,
  active,
  count,
  dotColor,
}: {
  href: string;
  label: string;
  active: boolean;
  count: number;
  dotColor?: string;
}) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 12px",
        fontSize: 13,
        fontWeight: active ? 500 : 400,
        color: active ? "var(--primary-foreground)" : "var(--foreground-secondary)",
        backgroundColor: active ? "var(--primary)" : "var(--surface)",
        border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
        borderRadius: 6,
        textDecoration: "none",
      }}
    >
      {dotColor ? <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: dotColor }} /> : null}
      {label}
      <span style={{ fontSize: 11, color: active ? "rgba(255,255,255,0.6)" : "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>
        {count}
      </span>
    </a>
  );
}
