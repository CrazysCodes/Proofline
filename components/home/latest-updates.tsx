import Link from "next/link";

import { formatDate } from "@/components/content/post-row";
import { SectionHeader } from "@/components/ui/badges";
import type { PostEntry, ProjectEntry } from "@/lib/content/types";

export function LatestUpdates({ posts, projects }: { posts: PostEntry[]; projects: ProjectEntry[] }) {
  const updates = [
    ...posts.slice(0, 3).map((post) => ({
      type: "Article",
      title: post.title,
      href: `/writing/${post.slug}`,
      date: post.date,
      meta: post.category,
    })),
    ...projects.slice(0, 2).map((project) => ({
      type: "Project",
      title: project.name,
      href: `/projects/${project.slug}`,
      date: project.date,
      meta: project.status,
    })),
  ]
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 4);

  if (!updates.length) return null;

  return (
    <section className="container" style={{ paddingTop: 56 }}>
      <SectionHeader title="Latest Updates" href="/archive" action="Archive →" />
      <div className="surface-card" style={{ marginTop: 16, overflow: "hidden" }}>
        {updates.map((update, index) => (
          <Link
            key={`${update.type}-${update.href}`}
            href={update.href}
            style={{
              display: "grid",
              gridTemplateColumns: "92px 1fr auto",
              gap: 14,
              alignItems: "center",
              padding: "14px 18px",
              borderTop: index ? "1px solid var(--border)" : undefined,
              textDecoration: "none",
            }}
          >
            <span style={{ fontSize: 11, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>
              {formatDate(update.date)}
            </span>
            <span style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>{update.title}</span>
            <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>{update.type}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
