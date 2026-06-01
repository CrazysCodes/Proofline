import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate } from "@/components/content/post-row";
import { CategoryTag, TagPill } from "@/components/ui/badges";
import { getPost, listPosts } from "@/lib/content/collections";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug).catch(() => null), listPosts()]);
  if (!post) notFound();

  const otherPosts = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div className="detail-grid">
        <main>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 24 }}>
            <Link href="/" style={{ fontSize: 13, color: "var(--foreground-muted)", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "var(--border)" }}>/</span>
            <Link href="/writing" style={{ fontSize: 13, color: "var(--foreground-muted)", textDecoration: "none" }}>Writing</Link>
            <span style={{ color: "var(--border)" }}>/</span>
            <span style={{ fontSize: 13, color: "var(--foreground-secondary)" }}>{post.title.slice(0, 30)}…</span>
          </div>

          <header style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
              <CategoryTag category={post.category} />
              <span style={{ fontSize: 12, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>
                {formatDate(post.date, true)}
              </span>
              <span style={{ fontSize: 12, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>
                · {post.readingTime} min read
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.1rem)",
                fontWeight: 700,
                color: "var(--foreground)",
                letterSpacing: "-0.03em",
                lineHeight: 1.25,
                margin: "0 0 12px",
              }}
            >
              {post.title}
            </h1>

            {post.description ? (
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--foreground-secondary)", margin: 0 }}>
                {post.description}
              </p>
            ) : null}
          </header>

          <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.html }} />

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 8 }}>Tags</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} style={{ textDecoration: "none" }}>
                  <TagPill tag={tag} />
                </Link>
              ))}
            </div>
          </div>
        </main>

        <aside className="desktop-only" style={{ position: "sticky", top: 80 }}>
          <div className="surface-card" style={{ padding: 18, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              More Articles
            </div>
            {otherPosts.map((item, index) => (
              <Link key={item.slug} href={`/writing/${item.slug}`} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    padding: "8px 0",
                    borderBottom: index < otherPosts.length - 1 ? "1px solid var(--border)" : "none",
                    fontSize: 12,
                    lineHeight: 1.4,
                    color: "var(--foreground-secondary)",
                  }}
                >
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/writing"
            style={{
              display: "block",
              textAlign: "center",
              padding: "8px 12px",
              fontSize: 13,
              color: "var(--foreground-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              textDecoration: "none",
              backgroundColor: "var(--surface)",
            }}
          >
            ← All Writing
          </Link>
        </aside>
      </div>
    </div>
  );
}
