import type { Metadata } from "next";

import { contentLinkLabel, TagPill } from "@/components/ui/badges";
import { listPapers, listPosts } from "@/lib/content/collections";
import type { PaperEntry } from "@/lib/content/types";
import { getProfile } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "研究",
};

import { researchDirections } from "@/lib/research-directions";

export default async function ResearchPage() {
  const [papers, posts] = await Promise.all([listPapers(), listPosts()]);
  const profile = getProfile();
  const researchPosts = posts.filter((post) => [post.category, ...post.tags].some((item) => /research|paper|论文|研究/i.test(item)));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 className="page-title">
          研究资料
        </h1>
        <p style={{ fontSize: 14, color: "var(--foreground-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
          {profile.name} 的论文、报告、文档与代码，以及相关的公开研究资料。
        </p>
      </div>

      <div className="surface-card" style={{ padding: "20px 24px", marginBottom: 40 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
          研究方向
        </div>
        <div className="two-col">
          {researchDirections.map((direction) => (
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
          <span>资料库</span>
          {profile.links.scholar ? (
            <a href={profile.links.scholar} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: 12 }}>
              Google Scholar ↗
            </a>
          ) : null}
        </div>

        {papers.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {papers.map((paper) => (
              <PaperCard key={paper.slug} paper={paper} />
            ))}
          </div>
        ) : (
          <div className="surface-card" style={{ padding: "20px 24px", fontSize: 13, color: "var(--foreground-secondary)", lineHeight: 1.65 }}>
            研究资料正在整理中，后续会补充论文、文档与代码链接。
          </div>
        )}
      </div>

      <div style={{ border: "1px dashed var(--border)", borderRadius: 8, padding: "20px 24px" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 6 }}>研究笔记</div>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--foreground-secondary)", margin: "0 0 10px" }}>
          研究笔记与实验记录收录在文章栏目中，持续更新。
        </p>
        {researchPosts.length ? (
          <div style={{ display: "grid", gap: 8 }}>
            {researchPosts.slice(0, 4).map((post) => (
              <a key={post.slug} href={`/writing/${post.slug}`} className="text-link" style={{ fontSize: 13 }}>{post.title}</a>
            ))}
          </div>
        ) : (
          <a href="/writing" className="text-link" style={{ fontSize: 13 }}>浏览文章 →</a>
        )}
      </div>
    </div>
  );
}

function PaperCard({ paper }: { paper: PaperEntry }) {
  return (
    <article className="surface-card" style={{ padding: "22px 24px" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
        <FormatBadge format={paper.primaryFormat} />
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-purple)", backgroundColor: "var(--accent-purple-light)", padding: "2px 8px", borderRadius: 4, fontFamily: "var(--font-family-mono)" }}>
          {paper.documentType}
        </span>
        <span style={{ fontSize: 11, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>{paper.venue}</span>
        <span style={{ fontSize: 11, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>{paper.year}</span>
        {paper.status ? <span style={{ fontSize: 11, color: "var(--accent-blue)", backgroundColor: "var(--accent-blue-light)", padding: "2px 8px", borderRadius: 4 }}>{paper.status}</span> : null}
        {paper.featured ? <span style={{ fontSize: 10, fontWeight: 600, color: "var(--accent-amber)", letterSpacing: "0.04em" }}>★ 精选</span> : null}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)", margin: "0 0 5px", letterSpacing: "-0.02em", lineHeight: 1.4 }}>
        {paper.title}
      </h2>
      {paper.authors ? <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 10, fontStyle: "italic" }}>{paper.authors}</div> : null}
      {paper.abstract ? <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--foreground-secondary)", margin: "0 0 14px" }}>{paper.abstract}</p> : null}

      {paper.keywords.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
          {paper.keywords.map((keyword) => <TagPill key={keyword} tag={keyword} />)}
        </div>
      ) : null}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: paper.html ? 14 : 0 }}>
        {paper.links.length ? (
          paper.links.map((link) => (
            <a key={`${link.label}-${link.url}`} href={link.url} target="_blank" rel="noopener noreferrer" className="text-link" style={{ fontSize: 12 }}>
              {contentLinkLabel(link.label)} ↗
            </a>
          ))
        ) : (
          <span style={{ fontSize: 12, color: "var(--foreground-muted)" }}>仅有元信息</span>
        )}
      </div>

      {paper.html ? (
        <details style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <summary style={{ cursor: "pointer", fontSize: 12, color: "var(--foreground-secondary)", fontWeight: 500 }}>备注</summary>
          <div className="prose-content" style={{ marginTop: 12 }} dangerouslySetInnerHTML={{ __html: paper.html }} />
        </details>
      ) : null}
    </article>
  );
}

function FormatBadge({ format }: { format: string }) {
  const isDocument = format === "PDF" || format === "Word";
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: isDocument ? "var(--accent-green)" : "var(--foreground-secondary)",
        backgroundColor: isDocument ? "var(--accent-green-light)" : "var(--muted)",
        padding: "2px 8px",
        borderRadius: 4,
        fontFamily: "var(--font-family-mono)",
      }}
    >
      {format}
    </span>
  );
}
