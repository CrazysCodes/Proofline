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
  name: env("SITE_NAME", "Adong"),
  description: env("SITE_DESCRIPTION", "个人主页、博客、作品集与研究入口"),
  compliance: {
    icpRecord: env("ICP_RECORD"),
    icpRecordUrl: env("ICP_RECORD_URL", "https://beian.miit.gov.cn/"),
    publicSecurityRecord: env("PUBLIC_SECURITY_RECORD"),
    publicSecurityRecordUrl: env("PUBLIC_SECURITY_RECORD_URL"),
  },
};

export function getProfile(): SiteProfile {
  const name = env("AUTHOR_NAME", "Adong");
  const email = env("AUTHOR_EMAIL");

  return {
    name,
    title: env("AUTHOR_TITLE", "工程师 / 研究者 / 创造者"),
    tagline: env(
      "AUTHOR_TAGLINE",
      "构建实用的 AI 系统与开发者工具，让想法成为可以运行、可以验证的产品。",
    ),
    bio: env(
      "AUTHOR_BIO",
      "记录工程决策，构建小而完整的产品，把项目、笔记与研究资料持续整理成公开的创作轨迹。",
    ),
    location: env("AUTHOR_LOCATION", "中国"),
    email,
    status: env("AUTHOR_STATUS", "欢迎交流与合作"),
    currentWork: env("AUTHOR_CURRENT_WORK", "AI 系统与开发者工具"),
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
