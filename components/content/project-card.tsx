import Link from "next/link";

import { StatusBadge, TagPill } from "@/components/ui/badges";
import type { ProjectEntry } from "@/lib/content/types";

export function ProjectCard({ project, large = false }: { project: ProjectEntry; large?: boolean }) {
  const year = project.date ? new Date(project.date).getFullYear() : "";

  return (
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <article
        className="surface-card"
        style={{
          padding: large ? "24px" : "20px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <StatusBadge status={project.status} />
              {year ? (
                <span style={{ fontSize: 11, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>{year}</span>
              ) : null}
            </div>
            <h3
              style={{
                fontSize: large ? 17 : 15,
                fontWeight: 600,
                color: "var(--foreground)",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {project.name}
            </h3>
          </div>
          <span style={{ fontSize: 14, color: "var(--foreground-muted)", flexShrink: 0, marginTop: 2 }}>↗</span>
        </div>

        {project.description ? (
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground-secondary)", margin: 0, flex: 1 }}>
            {project.description}
          </p>
        ) : null}

        {large && project.result ? (
          <div style={{ padding: "8px 12px", backgroundColor: "var(--background)", borderRadius: 5, borderLeft: "2px solid var(--accent-blue)" }}>
            <div style={{ fontSize: 11, color: "var(--foreground-muted)", marginBottom: 2, fontFamily: "var(--font-family-mono)" }}>RESULT</div>
            <div style={{ fontSize: 12, color: "var(--foreground-secondary)", lineHeight: 1.5 }}>{project.result}</div>
          </div>
        ) : null}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: "auto" }}>
          {(project.tech.length ? project.tech : project.tags).slice(0, large ? 5 : 3).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>

        {project.links.length ? (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {project.links.slice(0, 3).map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("/") ? undefined : "_blank"}
                rel={link.url.startsWith("/") ? undefined : "noopener noreferrer"}
                style={{ fontSize: 12, color: "var(--accent-blue)", textDecoration: "none", fontWeight: 500 }}
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        ) : null}
      </article>
    </Link>
  );
}
