import path from "node:path";

export function contentRoot() {
  const configured = process.env.CONTENT_DIR?.trim() || "content";
  return path.isAbsolute(configured) ? configured : path.join(process.cwd(), configured);
}

export function assertSafeSlug(slug: string) {
  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    throw new Error("Invalid content slug");
  }
}

export function safeContentPath(...segments: string[]) {
  const root = path.resolve(contentRoot());
  const resolved = path.resolve(root, ...segments);

  if (resolved !== root && !resolved.startsWith(root + path.sep)) {
    throw new Error("Content path traversal blocked");
  }

  return resolved;
}

export function collectionDir(collection: string) {
  return safeContentPath(collection);
}

export function markdownFile(collection: string, slug: string) {
  assertSafeSlug(slug);
  return safeContentPath(collection, `${slug}.md`);
}
