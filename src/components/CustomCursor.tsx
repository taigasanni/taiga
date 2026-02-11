"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const clickable = el.closest(
        "a, button, [role='button'], input, textarea, select, [onclick]"
      );
      setIsHovering(!!clickable);

      const darkPage = el.closest(".dark-page");
      setOnDark(!!darkPage);
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

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
  }, [isVisible]);

  if (typeof window === "undefined") return null;

  const borderColor = onDark
    ? "rgba(255, 255, 255, 0.45)"
    : "rgba(0, 0, 0, 0.35)";

  const hoverBorder = "rgba(200, 60, 50, 0.7)";

  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
      style={{
        willChange: "transform",
        boxSizing: "border-box",
      }}
      animate={{
        width: isHovering ? 48 : 28,
        height: isHovering ? 48 : 28,
        opacity: isVisible ? 1 : 0,
        borderColor: isHovering ? hoverBorder : borderColor,
        borderWidth: isHovering ? 2 : 1.5,
        backgroundColor: isHovering ? "rgba(200, 60, 50, 0.08)" : "transparent",
      }}
      transition={{
        width: { duration: 0.25, ease: "easeOut" },
        height: { duration: 0.25, ease: "easeOut" },
        borderColor: { duration: 0.3 },
        borderWidth: { duration: 0.25 },
        backgroundColor: { duration: 0.3 },
        opacity: { duration: 0.2 },
      }}
    />
  );
}
