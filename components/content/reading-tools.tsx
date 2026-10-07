"use client";

import { useEffect, useRef, useState } from "react";

export function ReadingTools() {
  const progress = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const length = document.documentElement.scrollHeight - innerHeight;
        progress.current?.style.setProperty("--read-progress", String(length > 0 ? scrollY / length : 0));
        setShowTop(scrollY > innerHeight);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <><div className="reading-progress" ref={progress} aria-hidden="true" />{showTop ? <button className="reading-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}>↑ <span>回到顶部</span></button> : null}</>;
}
