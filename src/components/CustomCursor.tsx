"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";

function CursorDot() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);
  const hovering = useRef(false);
  const dark = useRef(false);

  const updateVisual = useCallback(() => {
    const el = cursorRef.current;
    if (!el) return;

    const h = hovering.current;
    const d = dark.current;

    el.style.width = h ? "48px" : "28px";
    el.style.height = h ? "48px" : "28px";
    el.style.borderWidth = h ? "2px" : "1.5px";
    el.style.borderColor = h
      ? "rgba(200, 60, 50, 0.7)"
      : d
        ? "rgba(255, 255, 255, 0.5)"
        : "rgba(0, 0, 0, 0.4)";
    el.style.backgroundColor = h ? "rgba(200, 60, 50, 0.08)" : "transparent";
  }, []);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;

      const wasH = hovering.current;
      hovering.current = !!t.closest(
        "a, button, [role='button'], input, textarea, select, [onclick]"
      );

      const wasD = dark.current;
      dark.current = !!t.closest(".dark-page");

      if (hovering.current !== wasH || dark.current !== wasD) {
        updateVisual();
      }
    };

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      raf.current = requestAnimationFrame(loop);
    };

    updateVisual();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf.current);
    };
  }, [updateVisual]);

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2147483647,
        pointerEvents: "none",
        borderRadius: "50%",
        borderStyle: "solid",
        borderWidth: "1.5px",
        borderColor: "rgba(0, 0, 0, 0.4)",
        backgroundColor: "transparent",
        width: "28px",
        height: "28px",
        willChange: "transform",
        boxSizing: "border-box",
        transition:
          "width 0.25s ease-out, height 0.25s ease-out, border-color 0.3s, border-width 0.25s, background-color 0.3s",
      }}
    />
  );
}

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(<CursorDot />, document.body);
}
