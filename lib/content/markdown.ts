import matter from "gray-matter";
import { load as loadYaml } from "js-yaml";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

export async function renderMarkdown(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["heading-anchor"] },
    })
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

export function parseFrontmatter(raw: string) {
  // Explicit engine avoids gray-matter's legacy safeLoad API and old YAML dependencies.
  return matter(raw, { engines: { yaml: (source: string) => loadYaml(source) as Record<string, unknown> } });
}

export function estimateReadingTime(markdown: string) {
  const text = markdown.replace(/<[^>]+>/g, " ");
  const chineseCharacters = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const words = text.replace(/[\u3400-\u9fff]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(chineseCharacters / 450 + words / 220));
}
