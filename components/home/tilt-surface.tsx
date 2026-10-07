"use client";

import { useRef, type ReactNode, type PointerEvent } from "react";

export function TiltSurface({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = frame.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    node.style.setProperty("--tilt-x", `${(0.5 - y) * 5}deg`);
    node.style.setProperty("--tilt-y", `${(x - 0.5) * 5}deg`);
    node.style.setProperty("--shine-x", `${x * 100}%`);
    node.style.setProperty("--shine-y", `${y * 100}%`);
  };
  const reset = () => { frame.current?.style.setProperty("--tilt-x", "0deg"); frame.current?.style.setProperty("--tilt-y", "0deg"); };
  return <div className="tilt-surface" ref={frame} onPointerMove={move} onPointerLeave={reset}>{children}</div>;
}
