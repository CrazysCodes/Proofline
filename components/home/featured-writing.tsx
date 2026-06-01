import { PostRow } from "@/components/content/post-row";
import { SectionHeader } from "@/components/ui/badges";
import type { PostEntry } from "@/lib/content/types";

export function FeaturedWriting({ posts }: { posts: PostEntry[] }) {
  const featured = posts.filter((post) => post.featured).slice(0, 3);
  const fallback = featured.length ? featured : posts.slice(0, 3);

  if (!fallback.length) return null;

  return (
    <section className="container" style={{ paddingTop: 56 }}>
      <SectionHeader title="Featured Writing" href="/writing" action="All writing →" />
      <div style={{ marginTop: 12 }}>
        {fallback.map((post, index) => (
          <PostRow key={post.slug} post={post} showBorder={index < fallback.length - 1} />
        ))}
      </div>
    </section>
  );
}
