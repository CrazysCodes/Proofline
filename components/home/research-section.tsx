import Link from "next/link";

import { SectionHeader, TagPill } from "@/components/ui/badges";
import type { PaperEntry, PostEntry } from "@/lib/content/types";

const fallbackDirections = [
  {
    area: "AI Systems",
    desc: "LLM applications, retrieval, evaluation, inference, and the infrastructure around useful AI products.",
    icon: "◎",
  },
  {
    area: "Developer Tooling",
    desc: "Tools that compress feedback loops for writing, reviewing, testing, and shipping software.",
    icon: "⌘",
  },
  {
    area: "Personal Knowledge",
    desc: "Durable notes, public writing, and systems for turning experiments into reusable memory.",
    icon: "◈",
  },
  {
    area: "Product Prototypes",
    desc: "Small complete products where design, implementation, and deployment meet.",
    icon: "▣",
  },
];

export function ResearchSection({ papers, posts }: { papers: PaperEntry[]; posts: PostEntry[] }) {
  const researchNotes = posts.filter((post) =>
    [post.category, ...post.tags].some((item) => /research|paper|论文|研究/i.test(item)),
  );

  return (
    <section className="container" style={{ paddingTop: 56 }}>
      <SectionHeader title="Research / Papers" href="/research" action="Research →" />

      <div className="two-col" style={{ marginTop: 20 }}>
        <div className="surface-card" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
            Directions
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {fallbackDirections.map((direction) => (
              <div key={direction.area} style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 16, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>{direction.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 2 }}>{direction.area}</div>
                  <p style={{ fontSize: 12, color: "var(--foreground-secondary)", lineHeight: 1.55, margin: 0 }}>{direction.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
            Materials
          </div>
          {papers.length ? (
            <div style={{ display: "grid", gap: 14 }}>
              {papers.slice(0, 2).map((paper) => (
                <div key={paper.slug}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--accent-purple)", background: "var(--accent-purple-light)", padding: "2px 8px", borderRadius: 4 }}>
                      {paper.venue}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>{paper.year}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 600, lineHeight: 1.4 }}>{paper.title}</div>
                </div>
              ))}
            </div>
          ) : researchNotes.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {researchNotes.slice(0, 3).map((post) => (
                <Link key={post.slug} href={`/writing/${post.slug}`} className="text-link" style={{ fontSize: 13 }}>
                  {post.title}
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--foreground-secondary)", margin: 0 }}>
              Add Markdown files under <code>content/papers</code> or tag posts with research-related tags to populate this section.
            </p>
          )}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 16 }}>
            {["research", "papers", "experiments"].map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
