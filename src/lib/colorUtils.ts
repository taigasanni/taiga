export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export function getTimeBasedColor(): HSLColor {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 10) {
    // Morning: blue
    return { h: 200, s: 30, l: 85 };
  } else if (hour >= 10 && hour < 16) {
    // Daytime: bright cyan
    return { h: 180, s: 20, l: 90 };
  } else if (hour >= 16 && hour < 19) {
    // Evening: orange
    return { h: 30, s: 40, l: 80 };
  } else {
    // Night: indigo
    return { h: 240, s: 25, l: 75 };
  }
}

export function hslToString(color: HSLColor, alpha?: number): string {
  if (alpha !== undefined) {
    return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${alpha})`;
  }
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

export function hslToHex(color: HSLColor): string {
  const l = color.l / 100;
  const s = color.s / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + color.h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function lerpHSL(a: HSLColor, b: HSLColor, t: number): HSLColor {
  // Handle hue wrapping
  let dh = b.h - a.h;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;

  return {
    h: ((a.h + dh * t) % 360 + 360) % 360,
    s: a.s + (b.s - a.s) * t,
    l: a.l + (b.l - a.l) * t,
  };
}

// Journal article theme colors
export const articleColors: Record<string, HSLColor> = {
  design: { h: 280, s: 30, l: 80 },
  marketing: { h: 150, s: 25, l: 82 },
  default: { h: 200, s: 20, l: 88 },
};
