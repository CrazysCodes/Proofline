import Link from "next/link";

import { getProfile } from "@/lib/site";

export function AboutPreview() {
  const profile = getProfile();

  return (
    <section className="container" style={{ paddingTop: 56, paddingBottom: 24 }}>
      <div
        style={{
          border: "1px dashed var(--border)",
          borderRadius: 8,
          padding: "22px 24px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 20,
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", marginBottom: 6 }}>About</div>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--foreground-secondary)", margin: 0, maxWidth: 620 }}>
            {profile.bio}
          </p>
        </div>
        <Link href="/about" className="text-link" style={{ fontSize: 13 }}>
          More →
        </Link>
      </div>
    </section>
  );
}
