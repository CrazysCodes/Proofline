import Link from "next/link";

import { contentLinkLabel, SectionHeader, TagPill } from "@/components/ui/badges";
import type { PaperEntry, PostEntry } from "@/lib/content/types";

import { researchDirections } from "@/lib/research-directions";

export function ResearchSection({ papers, posts }: { papers: PaperEntry[]; posts: PostEntry[] }) {
  const researchNotes = posts.filter((post) =>
    [post.category, ...post.tags].some((item) => /research|paper|论文|研究/i.test(item)),
  );

  return (
    <section className="container" style={{ paddingTop: 56 }}>
      <SectionHeader title="研究与论文" href="/research" action="研究资料 →" />

      <div className="two-col" style={{ marginTop: 20 }}>
        <div className="surface-card" style={{ padding: "20px 24px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
            研究方向
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {researchDirections.map((direction) => (
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
            资料
          </div>
          {papers.length ? (
            <div style={{ display: "grid", gap: 14 }}>
              {papers.slice(0, 2).map((paper) => (
                <div key={paper.slug}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "var(--accent-purple)", background: "var(--accent-purple-light)", padding: "2px 8px", borderRadius: 4 }}>
                      {paper.primaryFormat}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>{paper.year}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 600, lineHeight: 1.4 }}>{paper.title}</div>
                  {paper.links.length ? (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                      {paper.links.slice(0, 3).map((link) => (
                        <a key={`${paper.slug}-${link.label}`} href={link.url} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: 12 }}>
                          {contentLinkLabel(link.label)} ↗
                        </a>
                      ))}
                    </div>
                  ) : null}
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
              研究资料正在整理中，后续会补充论文、文档与代码链接。
            </p>
          )}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 16 }}>
            {["研究", "论文", "实验"].map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
