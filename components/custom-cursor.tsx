"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor="interactive"]';

function subscribeToCursorPreferences(onChange: () => void) {
  const finePointer = window.matchMedia("(pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handleChange = () => onChange();

  finePointer.addEventListener("change", handleChange);
  reducedMotion.addEventListener("change", handleChange);

  return () => {
    finePointer.removeEventListener("change", handleChange);
    reducedMotion.removeEventListener("change", handleChange);
  };
}

function getCursorEnabled() {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const enabled = useSyncExternalStore(
    subscribeToCursorPreferences,
    getCursorEnabled,
    () => false
  );
  const [hoveringInteractive, setHoveringInteractive] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let raf: number;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      setHoveringInteractive(Boolean(target.closest(INTERACTIVE_SELECTOR)));
    }

    function animateRing() {
      // smooth trailing follow via lerp, independent of mousemove event rate
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      raf = requestAnimationFrame(animateRing);
    }

    document.body.classList.add("custom-cursor-active");
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    raf = requestAnimationFrame(animateRing);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[300] w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-[var(--accent)] pointer-events-none"
      />
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 z-[300] rounded-full border pointer-events-none transition-[width,height,border-color,margin] duration-150 ease-out ${
          hoveringInteractive
            ? "w-9 h-9 -ml-[18px] -mt-[18px] border-[var(--accent)]"
            : "w-6 h-6 -ml-3 -mt-3 border-[var(--border-strong)]"
        }`}
      />
    </>
  );
}