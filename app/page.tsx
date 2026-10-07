import { AboutPreview } from "@/components/home/about-preview";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { FeaturedWriting } from "@/components/home/featured-writing";
import { Hero } from "@/components/home/hero";
import { HomeEffects } from "@/components/home/home-effects";
import { LatestUpdates } from "@/components/home/latest-updates";
import { ResearchSection } from "@/components/home/research-section";
import { listPapers, listPosts, listProjects } from "@/lib/content/collections";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, projects, papers] = await Promise.all([listPosts(), listProjects(), listPapers()]);
  const hasPortfolio = posts.some((post) => post.slug === "portfolio-showcase-2026");

  return (
    <HomeEffects>
      <Hero portfolioHref={hasPortfolio ? "/writing/portfolio-showcase-2026" : undefined} />
      <FeaturedProjects projects={projects} hasPortfolio={hasPortfolio} />
      <FeaturedWriting posts={posts} />
      <ResearchSection papers={papers} posts={posts} />
      <LatestUpdates posts={posts} projects={projects} />
      <AboutPreview />
    </HomeEffects>
  );
}
