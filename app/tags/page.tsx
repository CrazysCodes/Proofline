import type { Metadata } from "next";
import Link from "next/link";

import { listPapers, listPosts, listProjects } from "@/lib/content/collections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tags",
};

export default async function TagsPage() {
  const [posts, projects, papers] = await Promise.all([listPosts(), listProjects(), listPapers()]);
  const counts = new Map<string, number>();

  for (const tag of posts.flatMap((post) => post.tags)) counts.set(tag, (counts.get(tag) || 0) + 1);
  for (const tag of projects.flatMap((project) => project.tags)) counts.set(tag, (counts.get(tag) || 0) + 1);
  for (const tag of papers.flatMap((paper) => paper.keywords)) counts.set(tag, (counts.get(tag) || 0) + 1);

  const tags = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.03em", marginBottom: 6 }}>
          Tags
        </h1>
        <p style={{ fontSize: 14, color: "var(--foreground-secondary)", lineHeight: 1.6 }}>
          Browse writing, projects, and research by topic.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map(([tag, count]) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 11px",
              fontSize: 13,
              color: "var(--foreground-secondary)",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              textDecoration: "none",
              fontFamily: "var(--font-family-mono)",
            }}
          >
            #{tag}
            <span style={{ color: "var(--foreground-muted)" }}>{count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
