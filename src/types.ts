export interface FontFile {
  name: string;
  path: string;
  url: string;
  format: 'truetype' | 'opentype';
  bytes: number;
  sha256: string;
}

export interface FontEntry {
  id: string;
  name: string;
  cssFamily: string;
  localName: string;
  author: { key: string; name: string; sourceUrl: string | null };
  style: string;
  fontStyle: string;
  encoding: string;
  riskFlags: string[];
  file: FontFile;
  license: { status: string; id: string | null; url: string | null; note: string };
  attribution: Record<string, string>;
}

export interface Author {
  key: string;
  title: string;
  description: string;
  link: string;
  fontFolder: string;
}

export interface Catalog {
  version: string;
  name: string;
  description: string;
  upstream: string;
  authors: Author[];
  styles: string[];
  fonts: FontEntry[];
}
