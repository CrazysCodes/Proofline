"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HomeEffects({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const length = document.documentElement.scrollHeight - window.innerHeight;
        node.style.setProperty("--reading-progress", `${length > 0 ? window.scrollY / length : 0}`);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <div ref={root} className="home-page home-v2" style={{ paddingBottom: 80 }}><div className="home-progress" aria-hidden="true" />{children}</div>;
}
