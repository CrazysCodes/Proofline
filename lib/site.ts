export type SiteProfile = {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  status: string;
  currentWork: string;
  initials: string;
  links: {
    github: string;
    email: string;
    cv: string;
    papers: string;
    scholar: string;
    portfolio: string;
  };
};

function env(name: string, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export const siteConfig = {
  url: trimTrailingSlash(env("SITE_URL", "http://localhost:3000")),
  name: env("SITE_NAME", "Proofline"),
  description: env("SITE_DESCRIPTION", "个人主页、博客、作品集与研究入口"),
};

export function getProfile(): SiteProfile {
  const name = env("AUTHOR_NAME", "Dongjun Hao");
  const email = env("AUTHOR_EMAIL");

  return {
    name,
    title: env("AUTHOR_TITLE", "Engineer · Researcher · Builder"),
    tagline: env(
      "AUTHOR_TAGLINE",
      "Building AI systems, developer tools, and durable personal knowledge infrastructure.",
    ),
    bio: env(
      "AUTHOR_BIO",
      "I write about engineering decisions, build small but complete products, and keep a public trail of projects, notes, and research materials.",
    ),
    location: env("AUTHOR_LOCATION", "China"),
    email,
    status: env("AUTHOR_STATUS", "Open to collaboration"),
    currentWork: env("AUTHOR_CURRENT_WORK", "AI systems + developer tooling"),
    initials: initials(name) || "VP",
    links: {
      github: env("GITHUB_URL", "https://github.com/CrazysCodes"),
      email: email ? `mailto:${email}` : "",
      cv: env("CV_URL"),
      papers: env("PAPER_URL", "/research"),
      scholar: env("GOOGLE_SCHOLAR_URL"),
      portfolio: env("PORTFOLIO_URL", "/projects"),
    },
  };
}

export function absoluteUrl(pathname = "/") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteConfig.url}${path}`;
}
