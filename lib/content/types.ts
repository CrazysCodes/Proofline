export type ContentLink = {
  label: string;
  url: string;
};

export type PostEntry = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  category: string;
  featured: boolean;
  readingTime: number;
  html: string;
};

export type ProjectStatus = "featured" | "active" | "building" | "archived";

export type ProjectEntry = {
  slug: string;
  name: string;
  date: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  tech: string[];
  links: ContentLink[];
  repo?: string;
  demo?: string;
  featured: boolean;
  problem: string;
  contribution: string;
  result: string;
  html: string;
};

export type PaperEntry = {
  slug: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  documentType: string;
  status: string;
  primaryFormat: string;
  abstract: string;
  keywords: string[];
  links: ContentLink[];
  featured: boolean;
  html: string;
};

export type PageEntry = {
  slug: string;
  title: string;
  description: string;
  html: string;
};
