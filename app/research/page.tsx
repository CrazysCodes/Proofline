import type { Metadata } from "next";

import { TagPill } from "@/components/ui/badges";
import { listPapers, listPosts } from "@/lib/content/collections";
import { getProfile } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research",
};

const directions = [
  {
    area: "AI Systems",
    desc: "LLM applications, retrieval, evaluation, inference, and production constraints.",
    icon: "◎",
  },
  {
    area: "Developer Tooling",
    desc: "Interfaces and workflows that make software work easier to reason about.",
    icon: "⌧",
  },
  {
    area: "Human-AI Interaction",
    desc: "How people build trust with AI tools through evidence, calibration, and feedback.",
    icon: "◈",
  },
  {
    area: "Knowledge Infrastructure",
    desc: "Public notes, durable content systems, and personal research memory.",
    icon: "▣",
  },
];

export default async function ResearchPage() {
  const [papers, posts] = await Promise.all([listPapers(), listPosts()]);
  const profile = getProfile();
  const researchPosts = posts.filter((post) => [post.category, ...post.tags].some((item) => /research|paper|论文|研究/i.test(item)));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.03em", marginBottom: 6 }}>
          Research
        </h1>
        <p style={{ fontSize: 14, color: "var(--foreground-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
          Research notes, papers, experiments, and public materials connected to {profile.name}'s current work.
        </p>
      </div>

      <div className="surface-card" style={{ padding: "20px 24px", marginBottom: 40 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
          Research Directions
        </div>
        <div className="two-col">
          {directions.map((direction) => (
            <div key={direction.area} style={{ padding: "14px 16px", backgroundColor: "var(--background)", borderRadius: 6, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>{direction.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{direction.area}</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--foreground-secondary)", margin: 0 }}>{direction.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Publications</span>
          {profile.links.scholar !== "#" ? (
            <a href={profile.links.scholar} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: 12 }}>
              Google Scholar ↗
            </a>
          ) : null}
        </div>

        {papers.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {papers.map((paper) => (
              <div key={paper.slug} className="surface-card" style={{ padding: "22px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-purple)", backgroundColor: "var(--accent-purple-light)", padding: "2px 8px", borderRadius: 4, fontFamily: "var(--font-family-mono)" }}>
                    {paper.venue}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>{paper.year}</span>
                  {paper.featured ? <span style={{ fontSize: 10, fontWeight: 600, color: "var(--accent-amber)", letterSpacing: "0.04em" }}>★ FEATURED</span> : null}
                </div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)", margin: "0 0 4px", letterSpacing: "-0.02em", lineHeight: 1.4 }}>
                  {paper.title}
                </h2>
                {paper.authors ? <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 10, fontStyle: "italic" }}>{paper.authors}</div> : null}
                {paper.abstract ? <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground-secondary)", margin: "0 0 14px" }}>{paper.abstract}</p> : null}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                  {paper.keywords.map((keyword) => <TagPill key={keyword} tag={keyword} />)}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {paper.links.map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: 12 }}>
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="surface-card" style={{ padding: "18px 20px", fontSize: 13, color: "var(--foreground-secondary)", lineHeight: 1.65 }}>
            No paper files yet. Add Markdown files under <code>content/papers</code> to publish papers here.
          </div>
        )}
      </div>

      <div style={{ border: "1px dashed var(--border)", borderRadius: 8, padding: "20px 24px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 6 }}>Research Notes</div>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--foreground-secondary)", margin: "0 0 10px" }}>
          Informal notes and experiment logs live in Writing so they can be maintained as plain Markdown.
        </p>
        {researchPosts.length ? (
          <div style={{ display: "grid", gap: 8 }}>
            {researchPosts.slice(0, 4).map((post) => (
              <a key={post.slug} href={`/writing/${post.slug}`} className="text-link" style={{ fontSize: 13 }}>{post.title}</a>
            ))}
          </div>
        ) : (
          <a href="/writing" className="text-link" style={{ fontSize: 13 }}>Browse writing →</a>
        )}
      </div>
    </div>
  );
}
