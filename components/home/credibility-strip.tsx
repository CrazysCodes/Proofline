import type { PaperEntry, PostEntry, ProjectEntry } from "@/lib/content/types";

export function CredibilityStrip({
  posts,
  projects,
  papers,
}: {
  posts: PostEntry[];
  projects: ProjectEntry[];
  papers: PaperEntry[];
}) {
  const items = [
    { label: "Projects", value: projects.length || "0" },
    { label: "Articles", value: posts.length || "0" },
    { label: "Papers", value: papers.length || "0" },
    { label: "Mode", value: "Read-only" },
  ];

  return (
    <section className="container" style={{ paddingTop: 8 }}>
      <div
        className="surface-card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          overflow: "hidden",
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.label}
            style={{
              padding: "14px 18px",
              borderLeft: index ? "1px solid var(--border)" : undefined,
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--foreground)" }}>{item.value}</div>
            <div style={{ fontSize: 11, color: "var(--foreground-muted)", fontFamily: "var(--font-family-mono)" }}>{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
