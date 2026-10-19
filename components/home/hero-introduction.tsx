"use client";

import { useState } from "react";

type Props = {
  name: string;
  title: string;
  status: string;
  portfolioHref: string;
  links: { label: string; url: string }[];
};

export function HeroIntroduction({ name, title, status, portfolioHref, links }: Props) {
  const [mode, setMode] = useState<"social" | "resume">("social");
  const resume = mode === "resume";

  return (
    <div className="hero-main">
      <div className="hero-intro-line">
        <p>{resume ? "AI 应用 / Agent 工程 / 产品实践" : title}</p>
        <div className="hero-intro-controls">
          <span className={`hero-status ${resume ? "hero-status-resume" : ""}`}><span aria-hidden="true" />{resume ? "项目与能力概览" : status}</span>
          <div className="hero-mode-switch" role="group" aria-label="自我介绍视角">
            <button type="button" aria-pressed={!resume} aria-controls="hero-introduction" onClick={() => setMode("social")}><span aria-hidden="true" />Social</button>
            <button type="button" aria-pressed={resume} aria-controls="hero-introduction" onClick={() => setMode("resume")}><span aria-hidden="true" />Resume</button>
          </div>
        </div>
      </div>
      <h1>{name}<span className="hero-period">.</span></h1>
      <div className="hero-bottom">
        <div className="hero-description hero-mode-description" id="hero-introduction" aria-live="polite" aria-atomic="true">
          <p className="hero-mode-eyebrow">{resume ? "把想法推进到可验证的交付" : "写代码，也记录沿途的判断"}</p>
          <div className="hero-mode-copy" key={mode}>
            <p>{resume ? <>我关注 <strong>AI 应用与 Agent 工程</strong>，实践覆盖多用户助手、<strong>Agentic search</strong>、受控工具和服务部署。习惯从需求与权限边界出发，把实现、评测与上线串成完整链路。</> : `你好，我是 ${name}。这里展示我的项目、文章与研究记录；这些是可以替换的演示内容。`}</p>
            <p className="hero-current">{resume ? "项目证据：演示项目 · 技术文章 · 研究记录" : "欢迎探索项目与文章，了解从想法到实现的过程。"}</p>
          </div>
        </div>
        <div className="hero-actions">
          <a className="hero-primary" href={portfolioHref}>{resume ? "查看项目与成果" : "探索我的作品"} <span aria-hidden="true">↗</span></a>
          <div className="hero-secondary">
            {links.map(link => <a key={link.label} href={link.url} target={link.url.startsWith("/") || link.url.startsWith("mailto:") ? undefined : "_blank"} rel={link.url.startsWith("/") || link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}>{link.label}</a>)}
          </div>
        </div>
      </div>
    </div>
  );
}
