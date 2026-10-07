"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type PublicViews = {
  generatedAt: string;
  demo?: boolean;
  pages: Record<string, number>;
};

// All counters share the feed, including rows mounted after filtering.
let viewsRequest: Promise<PublicViews> | null = null;
let viewsRequestedAt = 0;

function loadPublicViews() {
  if (!viewsRequest || Date.now() - viewsRequestedAt > 5 * 60 * 1000) {
    viewsRequestedAt = Date.now();
    viewsRequest = fetch("/analytics/views.json")
      .then(async (response) => {
        if (!response.ok) throw new Error("Page views unavailable");
        const data: PublicViews = await response.json();
        if (!data || typeof data.pages !== "object" || data.pages === null || Array.isArray(data.pages)) {
          throw new Error("Invalid page views");
        }
        return data;
      })
      .catch((error) => {
        viewsRequest = null;
        throw error;
      });
  }
  return viewsRequest;
}

function analyticsPath(pathname: string) {
  let path = pathname;
  try {
    path = decodeURI(path);
  } catch {
    // Keep the URL path if it contains an invalid escape sequence.
  }
  return path === "/" ? path : path.replace(/\/+$/, "");
}

function isTrackedPath(path: string) {
  return ["/", "/about", "/archive", "/projects", "/research", "/tags", "/writing"].includes(path)
    || /^\/(?:writing|projects|tags)\/[^/]+$/.test(path);
}

export function PageViewCount({ placement = "footer", pagePath }: { placement?: "footer" | "post-meta" | "list"; pagePath?: string }) {
  const pathname = usePathname();
  const [views, setViews] = useState<PublicViews | null>(null);
  const path = analyticsPath(pagePath ?? pathname);
  const isWritingArticle = /^\/writing\/[^/]+$/.test(path);
  const shouldShow = placement === "list" || (placement === "post-meta" ? isWritingArticle : !isWritingArticle);

  useEffect(() => {
    if (!shouldShow) return;
    let cancelled = false;

    loadPublicViews()
      .then((data) => {
        if (!cancelled) setViews(data);
      })
      .catch(() => {
        if (!cancelled) setViews(null);
      });

    return () => { cancelled = true; };
  }, [path, shouldShow]);

  if (!views || !shouldShow) return null;

  if (!isTrackedPath(path)) return null;

  const count = views.pages[path] ?? 0;
  if (typeof count !== "number" || !Number.isFinite(count) || count < 0) return null;

  return (
    <span title={views.demo ? "本地演示数据" : "累计页面浏览量，每小时更新"} aria-label={`${placement === "list" ? "该文章" : "本页"}浏览 ${count.toLocaleString("zh-CN")} 次${views.demo ? "，演示数据" : ""}`}>
      {placement === "footer" ? `本页浏览 ${count.toLocaleString("zh-CN")} 次` : `${placement === "post-meta" ? "· " : ""}${count.toLocaleString("zh-CN")} 次浏览`}
      {views.demo ? "（演示）" : ""}
    </span>
  );
}
