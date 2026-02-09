"use client";

import { useState, useEffect, useCallback } from "react";
import { getTimeBasedColor, lerpHSL, type HSLColor } from "./colorUtils";

const STORAGE_KEY = "hakki-dye-state";

interface DyeState {
  progress: number; // 0-1, how much the site has been "dyed"
  lastColor: HSLColor;
  visitCount: number;
}

function loadDyeState(): DyeState {
  if (typeof window === "undefined") {
    return { progress: 0, lastColor: { h: 0, s: 0, l: 100 }, visitCount: 0 };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return { progress: 0, lastColor: { h: 0, s: 0, l: 100 }, visitCount: 0 };
}

function saveDyeState(state: DyeState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useColorState() {
  const [dyeState, setDyeState] = useState<DyeState>(() => loadDyeState());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentColor, setCurrentColor] = useState<HSLColor>(
    getTimeBasedColor()
  );

  // Update visit count on mount
  useEffect(() => {
    const saved = loadDyeState();
    const newState = {
      ...saved,
      visitCount: saved.visitCount + 1,
    };
    setDyeState(newState);
    saveDyeState(newState);
  }, []);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate combined dye progress
  const combinedProgress = Math.min(
    (dyeState.progress + scrollProgress) * 0.8 + dyeState.visitCount * 0.02,
    1
  );

  // Update current color based on time and progress
  useEffect(() => {
    const timeColor = getTimeBasedColor();
    const white: HSLColor = { h: timeColor.h, s: 0, l: 100 };
    const blended = lerpHSL(white, timeColor, combinedProgress);
    setCurrentColor(blended);
  }, [combinedProgress]);

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newState = {
        ...dyeState,
        progress: Math.max(dyeState.progress, scrollProgress * 0.3),
        lastColor: currentColor,
      };
      setDyeState(newState);
      saveDyeState(newState);
    }, 5000);

    return () => clearInterval(interval);
  }, [dyeState, scrollProgress, currentColor]);

  const setArticleColor = useCallback(
    (articleColor: HSLColor) => {
      setCurrentColor(lerpHSL(currentColor, articleColor, combinedProgress));
    },
    [currentColor, combinedProgress]
  );

  return {
    currentColor,
    scrollProgress,
    combinedProgress,
    dyeState,
    setArticleColor,
  };
}
