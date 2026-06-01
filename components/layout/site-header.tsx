import { getProfile } from "@/lib/site";

import { SiteHeaderClient } from "./site-header-client";

export function SiteHeader() {
  const profile = getProfile();
  return <SiteHeaderClient name={profile.name} githubUrl={profile.links.github} />;
}
