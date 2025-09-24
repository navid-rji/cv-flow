"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  roundedTop?: boolean;
  /** starting scale before entering */
  initialScale?: number; // e.g. 0.98 for subtle
  /** max scale once the section has just entered */
  maxScale?: number; // typically 1.0
  /** portion of the viewport height used as the "activation zone" near the bottom */
  zoneFraction?: number; // 0.2 => bottom 20% of viewport
}

export function ScrollSection({
  children,
  className = "",
  roundedTop = false,
  initialScale = 0.90,
  maxScale = 1,
  zoneFraction = 0.4,
}: ScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const zone = Math.max(1, vh * zoneFraction); // px height of the entry zone at bottom

      const top = rect.top;
      let progress = 0;

      // Below viewport: no scale-up
      if (top >= vh) {
        progress = 0;
      }
      // In the bottom activation zone: interpolate 0→1 as the top moves from vh → (vh - zone)
      else if (top <= vh && top >= vh - zone) {
        progress = (vh - top) / zone; // 0..1
      }
      // Past the zone (further into viewport): hold at max
      else if (top < vh - zone) {
        progress = 1;
      }

      const next =
        initialScale +
        (maxScale - initialScale) * Math.min(1, Math.max(0, progress));
      setScale(next);
    };

    const onScroll = () => {
      if (rafRef.current != null) return; // throttle to animation frame
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        compute();
      });
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [initialScale, maxScale, zoneFraction]);

  return (
    <div
      ref={sectionRef}
      className={cn(
        "ransition-transform ease-out will-change-transform origin-center",
        roundedTop && "rounded-t-[3rem]",
        className
      )}
      style={{ transform: `scaleX(${scale})` }}
    >
      {children}
    </div>
  );
}
