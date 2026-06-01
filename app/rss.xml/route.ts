import { listPosts } from "@/lib/content/collections";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { escapeXml } from "@/lib/xml";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await listPosts();
  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/writing/${post.slug}`);
      return [
        "<item>",
        `<title>${escapeXml(post.title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid>${escapeXml(url)}</guid>`,
        post.date ? `<pubDate>${new Date(post.date).toUTCString()}</pubDate>` : "",
        `<description>${escapeXml(post.description)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>${escapeXml(siteConfig.name)}</title><link>${escapeXml(siteConfig.url)}</link><description>${escapeXml(siteConfig.description)}</description>${items}</channel></rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
    },
  });
}
