import Link from "next/link";

import { getProfile, siteConfig } from "@/lib/site";

export function SiteFooter() {
  const profile = getProfile();
  const { icpRecord, icpRecordUrl, publicSecurityRecord, publicSecurityRecordUrl } = siteConfig.compliance;

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
        <span style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {icpRecord ? (
            <a href={icpRecordUrl} target="_blank" rel="noopener noreferrer" className="text-link">
              {icpRecord}
            </a>
          ) : null}
          {publicSecurityRecord && publicSecurityRecordUrl ? (
            <a
              href={publicSecurityRecordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              {publicSecurityRecord}
            </a>
          ) : null}
          {publicSecurityRecord && !publicSecurityRecordUrl ? <span>{publicSecurityRecord}</span> : null}
          <Link href="/rss.xml" className="text-link">
            RSS
          </Link>
          <Link href="/archive" className="text-link">
            Archive
          </Link>
          <Link href="/tags" className="text-link">
            Tags
          </Link>
        </span>
      </div>
    </footer>
  );
}
