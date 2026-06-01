import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: 480, margin: "120px auto", padding: "0 24px", textAlign: "center" }}>
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "var(--border)",
          letterSpacing: "-0.05em",
          lineHeight: 1,
          fontFamily: "var(--font-family-mono)",
          marginBottom: 16,
        }}
      >
        404
      </div>
      <div style={{ fontSize: 16, color: "var(--foreground-secondary)", marginBottom: 24 }}>Page not found.</div>
      <Link href="/" className="text-link">← Back to home</Link>
    </div>
  );
}
