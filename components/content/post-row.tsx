import Link from "next/link";

import { CategoryTag } from "@/components/ui/badges";
import { PageViewCount } from "@/components/layout/page-view-count";
import type { PostEntry } from "@/lib/content/types";

export function formatDate(dateStr: string, long = false) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    month: long ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostRow({ post, showBorder = true, headingLevel = 2, showViews = false }: { post: PostEntry; showBorder?: boolean; headingLevel?: 2 | 3; showViews?: boolean }) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <Link href={`/writing/${post.slug}`} style={{ textDecoration: "none" }}>
      <article
        className="post-list-item"
        style={{
          padding: "30px 0",
          borderBottom: showBorder ? "1px solid var(--border)" : "none",
          display: "grid",
          gridTemplateColumns: "100px 1fr",
          gap: 28,
        }}
      >
        <div style={{ paddingTop: 2 }}>
          <div style={{ fontSize: 12, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)", marginBottom: 4 }}>
            {formatDate(post.date)}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
            <CategoryTag category={post.category} />
            {showViews ? <span style={{ fontSize: 12, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}><PageViewCount placement="list" pagePath={`/writing/${post.slug}`} /></span> : null}
          </div>
          <Heading style={{ fontSize: 19, fontWeight: 600, color: "var(--foreground)", margin: "10px 0 12px", letterSpacing: "-0.02em", lineHeight: 1.6 }}>
            {post.title}
          </Heading>
          {post.description ? (
            <p className="post-list-summary" style={{ fontSize: 14, lineHeight: 1.8, color: "var(--foreground-muted)", margin: 0 }}>
              {post.description}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
