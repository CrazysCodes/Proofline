import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

// Read the deployment URL at request time instead of freezing build-time defaults.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
