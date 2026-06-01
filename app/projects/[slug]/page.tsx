import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge, TagPill } from "@/components/ui/badges";
import { getProject, listProjects } from "@/lib/content/collections";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug).catch(() => null);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProject(slug).catch(() => null), listProjects()]);
  if (!project) notFound();

  const year = project.date ? new Date(project.date).getFullYear() : "";
  const related = projects
    .filter((item) => item.slug !== project.slug && item.tags.some((tag) => project.tags.includes(tag)))
    .slice(0, 2);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 32 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--foreground-muted)", textDecoration: "none" }}>Home</Link>
        <span style={{ color: "var(--border)" }}>/</span>
        <Link href="/projects" style={{ fontSize: 13, color: "var(--foreground-muted)", textDecoration: "none" }}>Projects</Link>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--foreground-secondary)" }}>{project.name}</span>
      </div>

      <header style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <StatusBadge status={project.status} />
          {year ? <span style={{ fontSize: 12, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>{year}</span> : null}
        </div>

        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.03em", margin: "0 0 12px" }}>
          {project.name}
        </h1>

        {project.description ? (
          <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--foreground-secondary)", margin: "0 0 20px" }}>
            {project.description}
          </p>
        ) : null}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith("/") ? undefined : "_blank"}
              rel={link.url.startsWith("/") ? undefined : "noopener noreferrer"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 14px",
                fontSize: 13,
                color: "var(--foreground-secondary)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </header>

      <ProjectSections project={project} />

      <div className="surface-card" style={{ padding: "20px 24px", marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Tech Stack
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(project.tech.length ? project.tech : project.tags).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      </div>

      <div className="prose-content" dangerouslySetInnerHTML={{ __html: project.html }} />

      {related.length ? (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32, marginTop: 40 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 16 }}>Related Projects</div>
          <div style={{ display: "flex", gap: 12 }}>
            {related.map((item) => (
              <Link key={item.slug} href={`/projects/${item.slug}`} style={{ textDecoration: "none", flex: 1 }}>
                <div className="surface-card" style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, color: "var(--foreground)" }}>
                  {item.name}
                  <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginTop: 4 }}>
                    {(item.tech.length ? item.tech : item.tags).slice(0, 2).join(" · ")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProjectSections({ project }: { project: NonNullable<Awaited<ReturnType<typeof getProject>>> }) {
  const sections = [
    project.problem ? { label: "Problem", content: project.problem, icon: "⊘" } : null,
    project.contribution ? { label: "My Contribution", content: project.contribution, icon: "◈" } : null,
    project.result ? { label: "Result", content: project.result, icon: "◉" } : null,
  ].filter((section): section is { label: string; content: string; icon: string } => Boolean(section));

  if (!sections.length) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      {sections.map((section, index) => (
        <div
          key={section.label}
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderTopWidth: index ? 0 : 1,
            borderRadius: index === 0 && sections.length === 1 ? 8 : index === 0 ? "8px 8px 0 0" : index === sections.length - 1 ? "0 0 8px 8px" : 0,
            padding: "18px 22px",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: 14, color: "var(--foreground-muted)", marginTop: 1, fontFamily: "var(--font-family-mono)" }}>{section.icon}</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>
              {section.label}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--foreground-secondary)", margin: 0 }}>{section.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
