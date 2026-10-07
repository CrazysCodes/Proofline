import { getProfile } from "@/lib/site";
import { WorkWindow } from "./work-window";

export function Hero({ portfolioHref }: { portfolioHref?: string }) {
  const profile = getProfile();
  const links = [
    { label: "GitHub", url: profile.links.github },
    { label: "研究", url: profile.links.papers },
    profile.email ? { label: "邮件", url: profile.links.email } : null,
  ].filter((link): link is { label: string; url: string } => Boolean(link?.url));

  return (
    <section className="container home-hero">
      <div className="hero-stage">
      <div className="hero-main">
      <div className="hero-intro-line">
        <p>{profile.title}</p>
        <span className="hero-status"><span aria-hidden="true" />{profile.status}</span>
      </div>
      <h1>{profile.name}<span className="hero-period">.</span></h1>
      <div className="hero-bottom">
        <div className="hero-description">
          <p>{profile.tagline}</p>
          <p className="hero-current">近期关注：{profile.currentWork}</p>
        </div>
        <div className="hero-actions">
          <a className="hero-primary" href={portfolioHref || profile.links.portfolio}>探索我的作品 <span aria-hidden="true">↗</span></a>
          <div className="hero-secondary">
            {links.map((link) => (
              <a key={link.label} href={link.url}
                target={link.url.startsWith("/") || link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.url.startsWith("/") || link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      </div>
      <WorkWindow />
      </div>
    </section>
  );
}
