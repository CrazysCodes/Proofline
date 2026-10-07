import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate } from "@/components/content/post-row";
import { PageViewCount } from "@/components/layout/page-view-count";
import { ReadingTools } from "@/components/content/reading-tools";
import { TagPill } from "@/components/ui/badges";
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
    <div className="container reading-page" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <ReadingTools />
      <nav className="reading-back" aria-label="文章导航"><Link href="/writing">← 全部文章</Link></nav>
      <div className="reading-layout">
        <main>
          <div className="reading-breadcrumb" style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 24 }}>
            <Link href="/" style={{ fontSize: 13, color: "var(--foreground-muted)", textDecoration: "none" }}>首页</Link>
            <span style={{ color: "var(--border)" }}>/</span>
            <Link href="/writing" style={{ fontSize: 13, color: "var(--foreground-muted)", textDecoration: "none" }}>文章</Link>
            <span style={{ color: "var(--border)" }}>/</span>
            <span style={{ fontSize: 13, color: "var(--foreground-secondary)" }}>{post.title.slice(0, 30)}…</span>
          </div>

          <header className="reading-header">
            <div className="reading-meta">
              <span>{post.category}</span>
              <span style={{ fontSize: 12, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>
                {formatDate(post.date, true)}
              </span>
              <span style={{ fontSize: 12, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>
                <PageViewCount placement="post-meta" />
              </span>
            </div>

            <h1>
              {post.title}
            </h1>

            {post.description ? (
              <p>
                {post.description}
              </p>
            ) : null}
          </header>

          <div className="prose-content reading-body" dangerouslySetInnerHTML={{ __html: post.html }} />

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 8 }}>标签</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} style={{ textDecoration: "none" }}>
                  <TagPill tag={tag} />
                </Link>
              ))}
            </div>
          </div>
        </main>

        <aside className="reading-next">
          <div className="reading-next-links">
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              更多文章
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
            ← 全部文章
          </Link>
        </aside>
      </div>
    </div>
  );
}
