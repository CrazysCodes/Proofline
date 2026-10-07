import Link from "next/link";
import { formatDate } from "@/components/content/post-row";
import { SectionHeader } from "@/components/ui/badges";
import type { PostEntry } from "@/lib/content/types";

export function FeaturedWriting({ posts }: { posts: PostEntry[] }) {
  const featured = posts.filter((post) => post.featured).slice(0, 3);
  const fallback = featured.length ? featured : posts.slice(0, 3);

  if (!fallback.length) return null;

  return (
    <section className="container" style={{ paddingTop: 56 }}>
      <SectionHeader title="精选文章" href="/writing" action="全部文章 →" />
      <div className="featured-reading-grid">
        {fallback.map((post) => (
          <Link key={post.slug} href={`/writing/${post.slug}`} className="featured-reading-link">
            <article>
              <div className="featured-reading-meta"><span>{post.category}</span><time dateTime={post.date}>{formatDate(post.date)}</time></div>
              <h3>{post.title}</h3>
              {post.description ? <p>{post.description}</p> : null}
              <span className="featured-reading-action">阅读全文 <span aria-hidden="true">↗</span></span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
