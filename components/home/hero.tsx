import { getProfile } from "@/lib/site";
import { WorkWindow } from "./work-window";
import { HeroIntroduction } from "./hero-introduction";

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
      <HeroIntroduction name={profile.name} title={profile.title} status={profile.status} portfolioHref={portfolioHref || profile.links.portfolio} links={links} />
      <WorkWindow />
      </div>
    </section>
  );
}
