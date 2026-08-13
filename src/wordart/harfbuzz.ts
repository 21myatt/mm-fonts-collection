import * as hb from "harfbuzzjs";
import { fontUrl } from "../lib/fonts";
import type { FontEntry } from "../types";

type HarfBuzzFontHandle = {
  blob: hb.Blob;
  face: hb.Face;
  font: hb.Font;
};

export type ShapedGlyph = {
  glyphId: number;
  cluster: number;
  xAdvance: number;
  yAdvance: number;
  xOffset: number;
  yOffset: number;
  path: string;
  pathCommands: hb.SvgPathCommand[];
};

const fontCache = new Map<string, Promise<HarfBuzzFontHandle>>();

async function loadHarfBuzzFont(font: FontEntry) {
  const cached = fontCache.get(font.id);
  if (cached) return cached;
  const next = fetch(fontUrl(font))
    .then((response) => {
      if (!response.ok) throw new Error(`Font request failed (${response.status})`);
      return response.arrayBuffer();
    })
    .then((data) => {
      const blob = new hb.Blob(data);
      const face = new hb.Face(blob);
      return { blob, face, font: new hb.Font(face) };
    });
  fontCache.set(font.id, next);
  return next;
}

export async function shapeWordArtText(text: string, fontEntry: FontEntry, fontSize: number): Promise<{ glyphs: ShapedGlyph[]; width: number; ascender: number; descender: number }> {
  const handle = await loadHarfBuzzFont(fontEntry);
  handle.font.setScale(fontSize, fontSize);
  const buffer = new hb.Buffer();
  buffer.addText(text || " ");
  buffer.setScript("Mymr");
  buffer.setLanguage("my");
  buffer.guessSegmentProperties();
  hb.shape(handle.font, buffer);
  const infos = buffer.getGlyphInfos();
  const positions = buffer.getGlyphPositions();
  const glyphs = infos.map((info, index) => {
    const position = positions[index];
    return {
      glyphId: info.codepoint,
      cluster: info.cluster,
      xAdvance: position.xAdvance,
      yAdvance: position.yAdvance,
      xOffset: position.xOffset,
      yOffset: position.yOffset,
      path: handle.font.glyphToPath(info.codepoint),
      pathCommands: handle.font.glyphToJson(info.codepoint),
    };
  });
  const width = glyphs.reduce((sum, glyph) => sum + glyph.xAdvance, 0);
  const extents = handle.font.hExtents();
  return { glyphs, width, ascender: extents.ascender, descender: Math.abs(extents.descender) };
}
