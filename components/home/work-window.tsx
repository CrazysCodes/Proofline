"use client";

import { useState } from "react";

const paths = [
  { label: "产品", title: "抖抖先知", subtitle: "关心的主播开播了，微信告诉你。", description: "从开播检测到微信订阅提醒，把一个真实需求做成开源项目与微信小程序。", image: "/images/articles/douyin-watch-home.png", href: "/projects/douyin-live-alert", link: "了解这个产品", category: "开源项目 · 微信小程序" },
  { label: "研究", title: "HAS-DETR", subtitle: "实时轻量交通标志检测模型", description: "聚焦交通标志中的小目标识别，探索轻量结构、多尺度特征融合与检测精度之间的平衡。", image: null, href: "/research", link: "查看研究材料", category: "计算机视觉研究" },
  { label: "开源", title: "OpenCLI / HLTV", subtitle: "把个人需求，贡献成公共能力。", description: "13 个只读命令，让电竞赛事数据成为人和 Agent 都能使用的工具。", image: null, href: "/writing/opencli-hltv-contribution", link: "阅读贡献记录", category: "开源贡献" },
];

export function WorkWindow() {
  const [active, setActive] = useState(0);
  const item = paths[active];
  return (
    <div className="work-window">
      <div className="work-window-top"><span className="window-dots" aria-hidden="true"><i /><i /><i /></span><span>我的工作空间</span></div>
      <div className="work-switcher" aria-label="选择作品方向">
        {paths.map((path, index) => <button key={path.label} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>{path.label}<span aria-hidden="true">↗</span></button>)}
      </div>
      <div className="work-window-content" key={item.title} aria-live="polite">
        {active === 1 ? (
          <div className="work-window-copy research-paper-copy">
            <span>{item.category}</span>
            <h2>{item.title}</h2>
            <p className="paper-title">{item.subtitle}</p>
            <p className="paper-description">{item.description}</p>
            <p className="paper-venue">Journal of Real-Time Image Processing<br />2026</p>
            <a href="https://file.adong.org.cn/public/HAS-DETR.pdf" target="_blank" rel="noopener noreferrer">阅读论文 PDF<span aria-hidden="true">↗</span></a>
            <a href={item.href}>更多研究资料<span aria-hidden="true">↗</span></a>
          </div>
        ) : <>
        <div className={`work-window-preview ${item.image ? "miniprogram-preview" : ""}`}>
          {item.image ? <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt="抖抖先知小程序首页" />
          </> : <div className="cli-visual"><span>$ opencli hltv --help</span><p>search · player · matches<br />maps · team · events</p><span className="cli-comment">结构化数据，可组合的工具。</span></div>}
        </div>
        <div className="work-window-copy"><span>{item.category}</span><h2>{item.title}</h2><p className="work-subtitle">{item.subtitle}</p><p>{item.description}</p><a href={item.href} target={item.href.startsWith("https:") ? "_blank" : undefined} rel={item.href.startsWith("https:") ? "noopener noreferrer" : undefined}>{item.link}<span aria-hidden="true">↗</span></a></div>
        </>}
      </div>
    </div>
  );
}
