import { AboutPreview } from "@/components/home/about-preview";
import { CredibilityStrip } from "@/components/home/credibility-strip";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { FeaturedWriting } from "@/components/home/featured-writing";
import { Hero } from "@/components/home/hero";
import { LatestUpdates } from "@/components/home/latest-updates";
import { ResearchSection } from "@/components/home/research-section";
import { listPapers, listPosts, listProjects } from "@/lib/content/collections";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, projects, papers] = await Promise.all([listPosts(), listProjects(), listPapers()]);

  return (
    <div style={{ paddingBottom: 80 }}>
      <Hero />
      <CredibilityStrip posts={posts} projects={projects} papers={papers} />
      <FeaturedProjects projects={projects} />
      <ResearchSection papers={papers} posts={posts} />
      <FeaturedWriting posts={posts} />
      <LatestUpdates posts={posts} projects={projects} />
      <AboutPreview />
    </div>
  );
}
