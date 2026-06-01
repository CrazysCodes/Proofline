import type { Metadata } from "next";
import Link from "next/link";

import { formatDate } from "@/components/content/post-row";
import { listPosts } from "@/lib/content/collections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Archive",
};

export default async function ArchivePage() {
  const posts = await listPosts();
  const groups = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const key = post.date ? post.date.slice(0, 7) : "Undated";
    acc[key] ||= [];
    acc[key].push(post);
    return acc;
  }, {});

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.03em", marginBottom: 6 }}>
          Archive
        </h1>
        <p style={{ fontSize: 14, color: "var(--foreground-secondary)", lineHeight: 1.6 }}>
          Chronological index of all public writing.
        </p>
      </div>

      <div style={{ display: "grid", gap: 28 }}>
        {Object.entries(groups).map(([month, items]) => (
          <section key={month}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)", margin: "0 0 10px" }}>
              {month}
            </h2>
            <div className="surface-card" style={{ overflow: "hidden" }}>
              {items.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/writing/${post.slug}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: 16,
                    padding: "13px 16px",
                    borderTop: index ? "1px solid var(--border)" : undefined,
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: 12, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>
                    {formatDate(post.date)}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>{post.title}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
