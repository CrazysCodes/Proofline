import Link from "next/link";

import { CategoryTag, TagPill } from "@/components/ui/badges";
import type { PostEntry } from "@/lib/content/types";

export function formatDate(dateStr: string, long = false) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: long ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostRow({ post, showBorder = true }: { post: PostEntry; showBorder?: boolean }) {
  return (
    <Link href={`/writing/${post.slug}`} style={{ textDecoration: "none" }}>
      <article
        className="post-list-item"
        style={{
          padding: "20px 0",
          borderBottom: showBorder ? "1px solid var(--border)" : "none",
          display: "grid",
          gridTemplateColumns: "100px 1fr",
          gap: 16,
        }}
      >
        <div style={{ paddingTop: 2 }}>
          <div style={{ fontSize: 12, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)", marginBottom: 4 }}>
            {formatDate(post.date)}
          </div>
          <div style={{ fontSize: 11, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>
            {post.readingTime} min
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <CategoryTag category={post.category} />
            {post.featured ? (
              <span style={{ fontSize: 10, color: "var(--accent-amber)", fontWeight: 600, letterSpacing: "0.05em" }}>
                ★ FEATURED
              </span>
            ) : null}
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--foreground)", margin: "0 0 6px", letterSpacing: "-0.02em", lineHeight: 1.4 }}>
            {post.title}
          </h2>
          {post.description ? (
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--foreground-secondary)", margin: "0 0 8px" }}>
              {post.description}
            </p>
          ) : null}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
