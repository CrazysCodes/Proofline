import Link from "next/link";

import type { ProjectStatus } from "@/lib/content/types";

export const statusConfig: Record<ProjectStatus, { label: string; bg: string; text: string; dot: string }> = {
  featured: { label: "Featured", bg: "var(--accent-blue-light)", text: "var(--accent-blue)", dot: "#1d4ed8" },
  active: { label: "Active", bg: "var(--accent-green-light)", text: "var(--accent-green)", dot: "#15803d" },
  building: { label: "Building", bg: "var(--accent-amber-light)", text: "var(--accent-amber)", dot: "#b45309" },
  archived: { label: "Archived", bg: "var(--muted)", text: "var(--foreground-muted)", dot: "#a1a1aa" },
};

export function SectionHeader({ title, href, action }: { title: string; href?: string; action?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "var(--foreground-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: 0,
        }}
      >
        {title}
      </h2>
      {href && action ? (
        <Link href={href} className="text-link" style={{ fontSize: 12 }}>
          {action}
        </Link>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 7px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 500,
        backgroundColor: cfg.bg,
        color: cfg.text,
        fontFamily: "var(--font-family-mono)",
        letterSpacing: "0.01em",
      }}
    >
      {status === "active" ? (
        <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: cfg.text, flexShrink: 0 }} />
      ) : null}
      {cfg.label}
    </span>
  );
}

export function TagPill({ tag }: { tag: string }) {
  return (
    <span
      style={{
        padding: "2px 7px",
        fontSize: 11,
        color: "var(--foreground-muted)",
        backgroundColor: "var(--muted)",
        borderRadius: 4,
        fontFamily: "var(--font-family-mono)",
      }}
    >
      #{tag}
    </span>
  );
}

export function CategoryTag({ category }: { category: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        color: "var(--accent-purple)",
        backgroundColor: "var(--accent-purple-light)",
        borderRadius: 4,
        padding: "2px 7px",
        fontWeight: 500,
      }}
    >
      {category}
    </span>
  );
}
