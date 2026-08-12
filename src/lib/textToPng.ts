export interface TextRenderOptions {
  text: string;
  fontSize: number;
  lineHeight: number;
  textColor: string;
  fontFamily: string;
  padding: number;
}

export const defaultTextRenderOptions: TextRenderOptions = {
  text: "မင်္ဂလာပါ",
  fontSize: 96,
  lineHeight: 1.35,
  textColor: "#111827",
  fontFamily: "sans-serif",
  padding: 24,
};

export function renderTextToCanvas(
  canvas: HTMLCanvasElement,
  options: TextRenderOptions,
) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const lines = (options.text || " ").split("\n");
  context.font = fontValue(options);
  const metrics = measureLines(context, lines, options);
  const width = Math.max(1, Math.ceil(metrics.width + options.padding * 2));
  const height = Math.max(1, Math.ceil(metrics.height + options.padding * 2));

  canvas.width = width;
  canvas.height = height;
  context.font = fontValue(options);
  context.clearRect(0, 0, width, height);
  context.fillStyle = options.textColor;
  context.textAlign = "left";
  context.textBaseline = "alphabetic";

  const lineHeightPx = lineHeight(options);
  const firstLineY = options.padding + metrics.firstAscent;
  lines.forEach((line, index) => {
    context.fillText(line || " ", options.padding, firstLineY + index * lineHeightPx);
  });
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function measureLines(
  context: CanvasRenderingContext2D,
  lines: string[],
  options: TextRenderOptions,
) {
  const measured = lines.map((line) => context.measureText(line || " "));
  const first = measured[0];
  const last = measured[measured.length - 1];
  const fallbackAscent = options.fontSize * 0.8;
  const fallbackDescent = options.fontSize * 0.25;
  const firstAscent = first.actualBoundingBoxAscent || fallbackAscent;
  const lastDescent = last.actualBoundingBoxDescent || fallbackDescent;

  return {
    width: Math.max(...measured.map((item) => item.width)),
    height:
      (lines.length - 1) * lineHeight(options) + firstAscent + lastDescent,
    firstAscent,
  };
}

const fontValue = (options: TextRenderOptions) =>
  `${options.fontSize}px ${options.fontFamily}`;

const lineHeight = (options: TextRenderOptions) =>
  options.fontSize * options.lineHeight;
