import type { Metadata } from "next";

import { getPage } from "@/lib/content/collections";
import { getProfile } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "关于我",
};

export default async function AboutPage() {
  const [page, profile] = await Promise.all([getPage("about"), Promise.resolve(getProfile())]);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.03em", marginBottom: 6 }}>
          关于我
        </h1>
        <p style={{ fontSize: 14, color: "var(--foreground-secondary)", lineHeight: 1.7, maxWidth: 560 }}>
          {profile.bio}
        </p>
      </div>

      <div className="surface-card" style={{ padding: "18px 20px", marginBottom: 32, display: "grid", gap: 8, fontSize: 13, color: "var(--foreground-secondary)" }}>
        <div><strong style={{ color: "var(--foreground)" }}>名字：</strong> {profile.name}</div>
        <div><strong style={{ color: "var(--foreground)" }}>关注方向：</strong> {profile.currentWork}</div>
        <div><strong style={{ color: "var(--foreground)" }}>所在地：</strong> {profile.location}</div>
        {profile.email ? <div><strong style={{ color: "var(--foreground)" }}>邮箱：</strong> <a className="text-link" href={profile.links.email}>{profile.email}</a></div> : null}
      </div>

      {page ? (
        <article className="prose-content" dangerouslySetInnerHTML={{ __html: page.html }} />
      ) : (
        <div className="surface-card" style={{ padding: 20, color: "var(--foreground-secondary)" }}>
          关于我的更多介绍正在整理中。
        </div>
      )}
    </div>
  );
}
