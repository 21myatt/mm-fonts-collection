import type { FontEntry } from "../types";

const CDN_BASE =
  "https://cdn.jsdelivr.net/gh/21myatt/mm-fonts-cdn@v1.0.1/dist/1.0.1";

export const CDN_CSS_URL = `${CDN_BASE}/mmfonts.css`;

export const cdnUrl = (path: string) =>
  `${CDN_BASE}/${path.split("/").map(encodeURIComponent).join("/")}`;

export const fontUrl = (font: FontEntry) => cdnUrl(font.file.path);

export const formatBytes = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

export const previewFontFamily = (font: FontEntry) =>
  `TextPng-${font.id.replace(/[^a-z0-9]/gi, "-")}`;

export async function loadFontFace(font: FontEntry) {
  const family = previewFontFamily(font);
  const existing = Array.from(document.fonts).find(
    (face) => face.family === family,
  );
  if (existing) {
    await existing.load();
    return family;
  }

  const face = new FontFace(
    family,
    `local("${font.localName.replaceAll('"', '\\"')}"), url("${fontUrl(font)}") format("${font.file.format}")`,
    {
      weight: /bold/i.test(font.fontStyle)
        ? "700"
        : /light/i.test(font.fontStyle)
          ? "300"
          : "400",
      style: font.fontStyle.toLowerCase().includes("italic")
        ? "italic"
        : "normal",
      display: "swap",
    },
  );
  document.fonts.add(face);
  await face.load();
  return family;
}
