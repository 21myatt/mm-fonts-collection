import type { FontEntry } from "../types";

const CDN_BASE =
  "https://cdn.jsdelivr.net/gh/21myatt/mm-fonts-cdn@v1.0.1/dist/1.0.1";

export const CDN_CSS_URL = `${CDN_BASE}/mmfonts.css`;

export const cdnUrl = (path: string) =>
  `${CDN_BASE}/${path.split("/").map(encodeURIComponent).join("/")}`;

export const fontUrl = (font: FontEntry) => cdnUrl(font.file.path);

export const formatBytes = (bytes: number) => `${Math.round(bytes / 1024)} KB`;
