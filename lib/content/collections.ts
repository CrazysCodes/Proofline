import fs from "node:fs/promises";
import path from "node:path";

import { collectionDir, markdownFile } from "@/lib/content/paths";
import { estimateReadingTime, parseFrontmatter, renderMarkdown } from "@/lib/content/markdown";
import type { ContentLink, PageEntry, PaperEntry, PostEntry, ProjectEntry, ProjectStatus } from "@/lib/content/types";

type MatterData = Record<string, unknown>;

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asDateString(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "number") return String(value);
  return "";
}

function asBool(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function asLinks(data: MatterData) {
  const links: ContentLink[] = [];
  const rawLinks = data.links;

  if (Array.isArray(rawLinks)) {
    for (const item of rawLinks) {
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const label = asString(record.label);
        const url = asString(record.url);
        if (label && url) links.push({ label, url });
      }
    }
  }

  const repo = asString(data.repo);
  const demo = asString(data.demo);
  const paper = asString(data.paper);
  if (repo) links.push({ label: "GitHub", url: repo });
  if (demo) links.push({ label: "Demo", url: demo });
  if (paper) links.push({ label: "Paper", url: paper });

  return links;
}

async function readMarkdownFiles(collection: string) {
  const dir = collectionDir(collection);

  try {
    const names = await fs.readdir(dir);
    return names
      .filter((name) => !name.startsWith(".") && name.endsWith(".md"))
      .map((name) => ({ slug: path.basename(name, ".md"), file: path.join(dir, name) }));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

async function readRaw(collection: string, slug: string) {
  return fs.readFile(markdownFile(collection, slug), "utf8");
}

export async function listPosts(): Promise<PostEntry[]> {
  const files = await readMarkdownFiles("posts");
  const posts = await Promise.all(
    files.map(async ({ slug, file }) => {
      const raw = await fs.readFile(file, "utf8");
      const parsed = parseFrontmatter(raw);
      const data = parsed.data as MatterData;
      if (asBool(data.draft)) return null;

      return {
        slug,
        title: asString(data.title, slug),
        date: asDateString(data.date),
        description: asString(data.description),
        tags: asStringArray(data.tags),
        category: asString(data.category, "Notes"),
        featured: asBool(data.featured),
        readingTime: estimateReadingTime(parsed.content),
        html: await renderMarkdown(parsed.content),
      } satisfies PostEntry;
    }),
  );

  return posts
    .filter((post): post is PostEntry => Boolean(post))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export async function getPost(slug: string) {
  const raw = await readRaw("posts", slug);
  const parsed = parseFrontmatter(raw);
  const data = parsed.data as MatterData;
  if (asBool(data.draft)) return null;

  return {
    slug,
    title: asString(data.title, slug),
    date: asDateString(data.date),
    description: asString(data.description),
    tags: asStringArray(data.tags),
    category: asString(data.category, "Notes"),
    featured: asBool(data.featured),
    readingTime: estimateReadingTime(parsed.content),
    html: await renderMarkdown(parsed.content),
  } satisfies PostEntry;
}

export async function listProjects(): Promise<ProjectEntry[]> {
  const files = await readMarkdownFiles("projects");
  const projects = await Promise.all(
    files.map(async ({ slug, file }) => {
      const raw = await fs.readFile(file, "utf8");
      const parsed = parseFrontmatter(raw);
      const data = parsed.data as MatterData;
      if (asBool(data.draft)) return null;

      const status = asString(data.status, asBool(data.featured) ? "featured" : "active") as ProjectStatus;

      const project: ProjectEntry = {
        slug,
        name: asString(data.name, asString(data.title, slug)),
        date: asDateString(data.date),
        description: asString(data.description),
        status: ["featured", "active", "building", "archived"].includes(status) ? status : "active",
        tags: asStringArray(data.tags),
        tech: asStringArray(data.tech).length ? asStringArray(data.tech) : asStringArray(data.tags),
        links: asLinks(data),
        repo: asString(data.repo) || undefined,
        demo: asString(data.demo) || undefined,
        featured: asBool(data.featured),
        problem: asString(data.problem),
        contribution: asString(data.contribution),
        result: asString(data.result),
        html: await renderMarkdown(parsed.content),
      };

      return project;
    }),
  );

  return projects.filter((project): project is ProjectEntry => project !== null);
}

export async function getProject(slug: string) {
  const raw = await readRaw("projects", slug);
  const parsed = parseFrontmatter(raw);
  const data = parsed.data as MatterData;
  if (asBool(data.draft)) return null;

  const status = asString(data.status, asBool(data.featured) ? "featured" : "active") as ProjectStatus;

  const project: ProjectEntry = {
    slug,
    name: asString(data.name, asString(data.title, slug)),
    date: asDateString(data.date),
    description: asString(data.description),
    status: ["featured", "active", "building", "archived"].includes(status) ? status : "active",
    tags: asStringArray(data.tags),
    tech: asStringArray(data.tech).length ? asStringArray(data.tech) : asStringArray(data.tags),
    links: asLinks(data),
    repo: asString(data.repo) || undefined,
    demo: asString(data.demo) || undefined,
    featured: asBool(data.featured),
    problem: asString(data.problem),
    contribution: asString(data.contribution),
    result: asString(data.result),
    html: await renderMarkdown(parsed.content),
  };

  return project;
}

export async function listPapers(): Promise<PaperEntry[]> {
  const files = await readMarkdownFiles("papers");
  const papers = await Promise.all(
    files.map(async ({ slug, file }) => {
      const raw = await fs.readFile(file, "utf8");
      const parsed = parseFrontmatter(raw);
      const data = parsed.data as MatterData;
      if (asBool(data.draft)) return null;

      return {
        slug,
        title: asString(data.title, slug),
        authors: asString(data.authors),
        venue: asString(data.venue, "Working Note"),
        year: Number(data.year || new Date().getFullYear()),
        abstract: asString(data.abstract, asString(data.description)),
        keywords: asStringArray(data.keywords).length ? asStringArray(data.keywords) : asStringArray(data.tags),
        links: asLinks(data),
        featured: asBool(data.featured),
        html: await renderMarkdown(parsed.content),
      } satisfies PaperEntry;
    }),
  );

  return papers.filter((paper): paper is PaperEntry => Boolean(paper)).sort((a, b) => b.year - a.year);
}

export async function getPage(slug: string): Promise<PageEntry | null> {
  try {
    const raw = await readRaw("pages", slug);
    const parsed = parseFrontmatter(raw);
    const data = parsed.data as MatterData;

    return {
      slug,
      title: asString(data.title, slug),
      description: asString(data.description),
      html: await renderMarkdown(parsed.content),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}
