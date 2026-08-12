import { useEffect, useState } from "react";
import { WORD_ART_PRESET_STYLES, type WordArtPreset } from "../lib/wordArtPresets";

const COLORS: Record<string, [string, string, string]> = {
  five: ["#d8d8d8", "#3333cc", "#9999ff"], six: ["#ffffff", "transparent", "#717171"],
  seven: ["#0066cc", "#99ccff", "#990000"], eight: ["#ff9a32", "transparent", "#cdcdcd"],
  nine: ["#cb00cc", "#d2a2fe", "#adadff"], ten: ["#1a4b28", "#008000", "#d2e5dc"],
  eleven: ["#0b2be0", "#eaeaea", "#cdcdcd"],
  twelve: ["#1b999c", "transparent", "#cdcdcd"], thirteen: ["#896640", "#1b0d00", "#1b0d00"],
  fourteen: ["#ff9999", "#002245", "#0050a0"], fifteen: ["#fecb00", "#b2b2b2", "#ab8d56"],
  sixteen: ["#33ccff", "#000099", "#000099"], seventeen: ["#ffff00", "#000000", "#999999"],
  eighteen: ["#ffffff", "#4a4a4a", "#4a4a4a"], nineteen: ["#0f3a1a", "#005600", "#000800"],
  twenty: ["#ffffff", "transparent", "#72745b"], twentyone: ["#fe4201", "#813300", "#c14d00"],
  twentytwo: ["#80302d", "#000000", "#a1a1a1"],
};

export function useWordArtControls(preset: WordArtPreset) {
  const style = WORD_ART_PRESET_STYLES[preset];
  const [fill, setFill] = useState(style.fill);
  const [outline, setOutline] = useState(style.outline);
  const [shadow, setShadow] = useState(style.shadow);
  const [gradientEnabled, setGradientEnabled] = useState(true);
  const [gradientStart, setGradientStart] = useState("#adadad");
  const [gradientEnd, setGradientEnd] = useState("#ffffff");
  const [gradientAngle, setGradientAngle] = useState(180);
  const [rotation, setRotation] = useState(-3);
  const [shadowX, setShadowX] = useState(3);
  const [shadowY, setShadowY] = useState(2);

  useEffect(() => {
    const colors = COLORS[preset] ?? [style.fill, style.outline, style.shadow];
    setFill(colors[0]); setOutline(colors[1]); setShadow(colors[2]);
    if (preset === "six") { setGradientStart("#adadad"); setGradientEnd("#ffffff"); setGradientAngle(180); setGradientEnabled(true); }
    if (preset === "eight") { setGradientStart("#fff812"); setGradientEnd("#ff9a32"); setGradientAngle(0); setGradientEnabled(true); }
  }, [preset, style.fill, style.outline, style.shadow]);

  return { fill, setFill, outline, setOutline, shadow, setShadow, gradientEnabled, setGradientEnabled, gradientStart, setGradientStart, gradientEnd, setGradientEnd, gradientAngle, setGradientAngle, rotation, setRotation, shadowX, setShadowX, shadowY, setShadowY };
}
