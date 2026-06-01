import type { MetadataRoute } from "next";

import { listPapers, listPosts, listProjects } from "@/lib/content/collections";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, papers] = await Promise.all([listPosts(), listProjects(), listPapers()]);
  const staticPages = ["", "/writing", "/projects", "/research", "/about", "/archive", "/tags"];

  return [
    ...staticPages.map((pathname) => ({ url: absoluteUrl(pathname || "/") })),
    ...posts.map((post) => ({ url: absoluteUrl(`/writing/${post.slug}`), lastModified: post.date || undefined })),
    ...projects.map((project) => ({ url: absoluteUrl(`/projects/${project.slug}`), lastModified: project.date || undefined })),
    ...papers.map((paper) => ({ url: absoluteUrl(`/research#${paper.slug}`) })),
  ];
}
