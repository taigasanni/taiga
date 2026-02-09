"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useColorState } from "./useColorState";
import { hslToString, type HSLColor } from "./colorUtils";

interface ColorContextType {
  currentColor: HSLColor;
  scrollProgress: number;
  combinedProgress: number;
  setArticleColor: (color: HSLColor) => void;
}

const ColorContext = createContext<ColorContextType>({
  currentColor: { h: 200, s: 30, l: 85 },
  scrollProgress: 0,
  combinedProgress: 0,
  setArticleColor: () => {},
});

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const colorState = useColorState();

  // Update CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      "--accent-h",
      String(colorState.currentColor.h)
    );
    root.style.setProperty(
      "--accent-s",
      `${colorState.currentColor.s}%`
    );
    root.style.setProperty(
      "--accent-l",
      `${colorState.currentColor.l}%`
    );
    root.style.setProperty(
      "--accent",
      hslToString(colorState.currentColor)
    );
  }, [colorState.currentColor]);

  return (
    <ColorContext.Provider value={colorState}>{children}</ColorContext.Provider>
  );
}

export function useColor() {
  return useContext(ColorContext);
}
