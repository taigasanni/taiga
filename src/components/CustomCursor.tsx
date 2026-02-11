"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);
  const hovering = useRef(false);
  const onDark = useRef(false);

  const updateStyle = useCallback(() => {
    const el = cursorRef.current;
    if (!el) return;

    const h = hovering.current;
    const dark = onDark.current;

    el.style.width = h ? "48px" : "28px";
    el.style.height = h ? "48px" : "28px";
    el.style.borderWidth = h ? "2px" : "1.5px";
    el.style.borderColor = h
      ? "rgba(200, 60, 50, 0.7)"
      : dark
        ? "rgba(255, 255, 255, 0.45)"
        : "rgba(0, 0, 0, 0.35)";
    el.style.backgroundColor = h ? "rgba(200, 60, 50, 0.08)" : "transparent";
  }, []);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const el = cursorRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (el.style.opacity !== "1") {
        el.style.opacity = "1";
      }
    };

    const handleMouseEnter = () => {
      el.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      el.style.opacity = "0";
    };

    const handleElementHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement;

      const clickable = t.closest(
        "a, button, [role='button'], input, textarea, select, [onclick]"
      );
      const wasHovering = hovering.current;
      hovering.current = !!clickable;

      const wasDark = onDark.current;
      onDark.current = !!t.closest(".dark-page");

      if (hovering.current !== wasHovering || onDark.current !== wasDark) {
        updateStyle();
      }
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      raf.current = requestAnimationFrame(animate);
    };

    // Apply initial style
    updateStyle();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleElementHover);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleElementHover);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [updateStyle]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 99999,
        pointerEvents: "none",
        borderRadius: "50%",
        borderStyle: "solid",
        borderWidth: "1.5px",
        borderColor: "rgba(0, 0, 0, 0.35)",
        backgroundColor: "transparent",
        width: "28px",
        height: "28px",
        opacity: 0,
        willChange: "transform",
        boxSizing: "border-box",
        transition:
          "width 0.25s ease-out, height 0.25s ease-out, border-color 0.3s, border-width 0.25s, background-color 0.3s, opacity 0.2s",
      }}
    />
  );
}
