"use client";

import { useState } from "react";

const paths = [
  { label: "产品", title: "演示 Agent", subtitle: "一个入口，按需启用。", description: "用于展示产品介绍和能力示意的虚构项目，请替换为自己的内容。", image: null, href: "/projects/demo-agent", link: "查看演示项目", category: "产品示例" },
  { label: "研究", title: "研究示例", subtitle: "研究过程与验证方法", description: "用结构化材料记录问题、方法与结果，不虚构真实论文或研究成果。", image: null, href: "/research", link: "查看研究材料", category: "研究示例" },
  { label: "开源", title: "开发工具示例", subtitle: "把重复步骤整理成工具。", description: "用清楚的接口和可验证的输出展示工程实践。", image: null, href: "/projects/demo-tool", link: "查看工具示例", category: "开源示例" },
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
            <p className="paper-venue">演示研究材料<br />非真实发表记录</p>
            <a href={item.href}>更多研究资料<span aria-hidden="true">↗</span></a>
          </div>
        ) : <>
        <div className={`work-window-preview ${item.image ? "miniprogram-preview" : ""}`}>
          {item.image ? <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt="产品示意图" />
          </> : active === 0 ? <div className="nomi-visual"><div className="nomi-visual-heading"><span>AGENT</span><span>能力示意</span></div><p className="nomi-visual-title">轻量部署，按需生长。</p><div className="nomi-visual-capabilities"><span>用户隔离</span><span>团队知识</span><span>受控工具</span></div></div> : <div className="cli-visual"><span>$ demo-tool --help</span><p>search · inspect · list<br />export · check · status</p><span className="cli-comment">结构化数据，可组合的工具。</span></div>}
        </div>
        <div className="work-window-copy"><span>{item.category}</span><h2>{item.title}</h2><p className="work-subtitle">{item.subtitle}</p><p>{item.description}</p><a href={item.href} target={item.href.startsWith("https:") ? "_blank" : undefined} rel={item.href.startsWith("https:") ? "noopener noreferrer" : undefined}>{item.link}<span aria-hidden="true">↗</span></a></div>
        </>}
      </div>
    </div>
  );
}
