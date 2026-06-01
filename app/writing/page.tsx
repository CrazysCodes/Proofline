import type { Metadata } from "next";

import { PostRow } from "@/components/content/post-row";
import { listPosts } from "@/lib/content/collections";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing",
};

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const posts = await listPosts();
  const filtered = posts.filter((post) => {
    if (params.category && post.category !== params.category) return false;
    if (params.tag && !post.tags.includes(params.tag)) return false;
    return true;
  });

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.03em", marginBottom: 6 }}>
          Writing
        </h1>
        <p style={{ fontSize: 14, color: "var(--foreground-secondary)", lineHeight: 1.6 }}>
          Engineering notes, research logs, and project write-ups. {posts.length} articles.
        </p>
      </div>

      <FilterBar posts={posts} activeCategory={params.category} activeTag={params.tag} />

      <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 16, fontFamily: "var(--font-family-mono)" }}>
        {filtered.length} article{filtered.length !== 1 ? "s" : ""}
      </div>

      <div>
        {filtered.map((post, index) => (
          <PostRow key={post.slug} post={post} showBorder={index < filtered.length - 1} />
        ))}
      </div>
    </div>
  );
}

function FilterBar({
  posts,
  activeCategory,
  activeTag,
}: {
  posts: Awaited<ReturnType<typeof listPosts>>;
  activeCategory?: string;
  activeTag?: string;
}) {
  const categories = Array.from(new Set(posts.map((post) => post.category))).filter(Boolean);
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort();

  return (
    <div className="surface-card" style={{ padding: "14px 16px", marginBottom: 24 }}>
      <div style={{ marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: "var(--foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 10 }}>
          Category
        </span>
        <FilterLink href="/writing" label="All" active={!activeCategory} />
        {categories.map((category) => (
          <FilterLink
            key={category}
            href={activeCategory === category ? "/writing" : `/writing?category=${encodeURIComponent(category)}`}
            label={category}
            active={activeCategory === category}
          />
        ))}
      </div>
      <div>
        <span style={{ fontSize: 11, color: "var(--foreground-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 10 }}>
          Tag
        </span>
        {tags.slice(0, 12).map((tag) => (
          <FilterLink
            key={tag}
            href={activeTag === tag ? "/writing" : `/writing?tag=${encodeURIComponent(tag)}`}
            label={`#${tag}`}
            active={activeTag === tag}
            mono
          />
        ))}
      </div>
    </div>
  );
}

function FilterLink({ href, label, active, mono }: { href: string; label: string; active: boolean; mono?: boolean }) {
  return (
    <a
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 9px",
        marginRight: 4,
        marginBottom: 4,
        fontSize: 12,
        fontFamily: mono ? "var(--font-family-mono)" : "var(--font-family)",
        fontWeight: active ? 500 : 400,
        color: active ? "var(--surface)" : "var(--foreground-secondary)",
        backgroundColor: active ? "var(--foreground)" : "var(--muted)",
        borderRadius: 4,
        textDecoration: "none",
      }}
    >
      {label}
    </a>
  );
}
