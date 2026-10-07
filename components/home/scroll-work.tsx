"use client";

import { useEffect, useRef, useState } from "react";
import { TiltSurface } from "./tilt-surface";

type Work = { name: string; type: string; description: string; image: string; contain?: boolean; width: number; height: number; href: string; action: string };

function CliPreview() {
  return <div className="cli-visual work-cli-preview"><span>$ opencli hltv --help</span><p>search · player · matches<br />maps · team · events</p><span className="cli-comment">结构化数据，可组合的工具。</span></div>;
}

export function ScrollWork({ items }: { items: Work[] }) {
  const root = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!window.matchMedia("(min-width: 821px)").matches || !root.current) return;
        const bounds = root.current.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
        const target = window.innerHeight * 0.5;
        let closest = 0;
        let distance = Infinity;
        panels.current.forEach((panel, index) => {
          if (!panel) return;
          const rect = panel.getBoundingClientRect();
          const next = Math.abs(rect.top + rect.height / 2 - target);
          if (next < distance) { distance = next; closest = index; }
        });
        setActive(closest);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const select = (index: number) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panels.current[index]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    setActive(index);
  };
  const current = items[active];
  if (!current) return null;
  const external = current.href.startsWith("https:");

  return (
    <div className="scroll-work" ref={root}>
      <div className="work-story">
        {items.map((item, index) => (
          <article key={item.name} ref={node => { panels.current[index] = node; }} className={`work-story-panel ${active === index ? "is-current" : ""}`}>
            <div className="work-story-copy">
              <p className="showcase-type">{item.type}</p>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <a className="showcase-link" href={item.href} target={item.href.startsWith("https:") ? "_blank" : undefined} rel={item.href.startsWith("https:") ? "noopener noreferrer" : undefined}>{item.action} <span aria-hidden="true">↗</span></a>
            </div>
            <a className="work-mobile-image" href={item.href} target={item.href.startsWith("https:") ? "_blank" : undefined} rel={item.href.startsWith("https:") ? "noopener noreferrer" : undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {item.image ? <img className={item.contain ? "preview-contain" : undefined} src={`/images/articles/${item.image}`} alt={`${item.name} 产品首页截图`} width={item.width || undefined} height={item.height || undefined} loading="lazy" /> : <CliPreview />}
            </a>
          </article>
        ))}
      </div>

      <div className="scroll-work-stage">
        <div className="work-preview-navigation" aria-label="跳转到作品介绍">
          {items.map((item, index) => <button type="button" key={item.name} aria-pressed={active === index} onClick={() => select(index)}>{item.name}</button>)}
        </div>
        <TiltSurface>
          <div className={`work-preview-window work-tone-${active}`}>
            <div className="work-preview-bar"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><span>作品预览</span><span>{current.name}</span></div>
            <a className="work-preview-screen" href={current.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-label={`查看 ${current.name}`}>
              {items.map((item, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                item.image ? <img key={item.name} src={`/images/articles/${item.image}`} alt={active === index ? `${item.name} 产品首页截图` : ""} aria-hidden={active !== index} className={`${active === index ? "is-visible" : ""} ${item.contain ? "preview-contain" : ""}`} width={item.width || undefined} height={item.height || undefined} loading="lazy" /> : active === index ? <CliPreview key={item.name} /> : null
              ))}
            </a>
            <div className="work-preview-bottom"><span>{current.type}</span><span aria-hidden="true">↗</span></div>
          </div>
        </TiltSurface>
        <p className="work-scroll-hint">随页面滚动切换预览，也可以点击上方项目名称。</p>
      </div>
    </div>
  );
}
