import Link from "next/link";

import { getProfile } from "@/lib/site";

export function SiteFooter() {
  const profile = getProfile();

  return (
    <footer style={{ borderTop: "1px solid var(--border)", marginTop: 48 }}>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          paddingTop: 24,
          paddingBottom: 28,
          fontSize: 12,
          color: "var(--foreground-muted)",
        }}
      >
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/rss.xml" className="text-link">RSS</Link>
          <Link href="/archive" className="text-link">Archive</Link>
          <Link href="/tags" className="text-link">Tags</Link>
        </span>
      </div>
    </footer>
  );
}
