import type { Metadata } from "next";
import Link from "next/link";

import { PostRow } from "@/components/content/post-row";
import { ProjectCard } from "@/components/content/project-card";
import { listPosts, listProjects } from "@/lib/content/collections";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${decodeURIComponent(tag)}` };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const [posts, projects] = await Promise.all([listPosts(), listProjects()]);
  const matchingPosts = posts.filter((post) => post.tags.includes(tag));
  const matchingProjects = projects.filter((project) => project.tags.includes(tag));

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/tags" className="text-link" style={{ fontSize: 13 }}>← All tags</Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.03em", margin: "10px 0 6px" }}>
          #{tag}
        </h1>
      </div>

      {matchingPosts.length ? (
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 13, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Writing
          </h2>
          {matchingPosts.map((post, index) => (
            <PostRow key={post.slug} post={post} showBorder={index < matchingPosts.length - 1} />
          ))}
        </section>
      ) : null}

      {matchingProjects.length ? (
        <section>
          <h2 style={{ fontSize: 13, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Projects
          </h2>
          <div className="two-col">
            {matchingProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
