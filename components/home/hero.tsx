import { getProfile } from "@/lib/site";

const status = { bg: "var(--accent-green-light)", text: "var(--accent-green)", dot: "#15803d" };

export function Hero() {
  const profile = getProfile();
  const links = [
    { label: "GitHub", url: profile.links.github, primary: true },
    { label: "CV / Resume", url: profile.links.cv },
    { label: "Papers", url: profile.links.papers },
    { label: "Portfolio", url: profile.links.portfolio },
    profile.email ? { label: profile.email, url: profile.links.email } : null,
  ].filter((link): link is { label: string; url: string; primary?: boolean } => Boolean(link?.url));

  return (
    <section className="container" style={{ paddingTop: 64, paddingBottom: 48 }}>
      <div className="hero-grid">
        <div style={{ minWidth: 0 }}>
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "var(--foreground)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              margin: "0 0 10px 0",
            }}
          >
            {profile.name}
          </h1>

          <div
            style={{
              fontSize: 14,
              color: "var(--foreground-secondary)",
              letterSpacing: "0.02em",
              marginBottom: 20,
              fontWeight: 500,
            }}
          >
            {profile.title}
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--foreground-secondary)", maxWidth: 580, margin: "0 0 20px" }}>
            {profile.tagline}
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--foreground-muted)",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 5,
              padding: "5px 10px",
              marginBottom: 28,
              fontFamily: "var(--font-family-mono)",
            }}
          >
            <span>→</span>
            <span>Currently: {profile.currentWork}</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url.startsWith("mailto") || link.url.startsWith("/") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto") || link.url.startsWith("/") ? undefined : "noopener noreferrer"}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: link.primary ? 500 : 400,
                  color: link.primary ? "var(--primary-foreground)" : "var(--foreground-secondary)",
                  backgroundColor: link.primary ? "var(--primary)" : "var(--surface)",
                  border: link.primary ? "1px solid var(--primary)" : "1px solid var(--border)",
                  borderRadius: 6,
                  textDecoration: "none",
                  letterSpacing: "-0.01em",
                }}
              >
                {link.label}
                {!link.url.startsWith("mailto") ? <span style={{ fontSize: 11, opacity: 0.7 }}>↗</span> : null}
              </a>
            ))}
          </div>
        </div>

        <div className="hero-aside" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, paddingTop: 4 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              border: "3px solid var(--border)",
            }}
          >
            {profile.initials}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 20,
              backgroundColor: status.bg,
              border: `1px solid ${status.dot}22`,
              fontSize: 11,
              fontWeight: 500,
              color: status.text,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: status.dot }} />
            {profile.status}
          </div>

          <div style={{ fontSize: 11, color: "var(--foreground-muted)", textAlign: "center" }}>{profile.location}</div>
        </div>
      </div>
    </section>
  );
}
