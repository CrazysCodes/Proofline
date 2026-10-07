---
name: ShipReadme
date: 2026-06-02
description: 根据真实仓库文件诊断 README，输出可追溯的改进建议与草案。
status: archived
tags: [readme, github, developer-tools]
tech: [Next.js, TypeScript, GitHub REST API, Docker]
repo: https://github.com/CrazysCodes/ShipReadme
demo: https://shipreadme.adong.org.cn
featured: false
draft: false
---

## 当前状态

已归档。保留项目介绍与代码，作为一次产品实践的记录。

## 解决的问题

开源项目的 README 不仅需要写清价值，还需要让 Quick Start、配置、测试与部署步骤真正可运行。ShipReadme 分析公开 GitHub 仓库，为每条建议提供文件证据，而不是补出看似专业却不存在的命令。

## 核心流程

仓库地址 → 默认分支文件树与关键文件 → Quick Start、配置、测试、部署、许可证、贡献指南和截图诊断 → Readiness Score、修复计划与 Markdown 草案。

首版采用规则引擎和模板，不强依赖 AI；不做登录、OAuth、私有仓库分析、自动 PR 或长期监控。可选服务端 GitHub Token 只用于提高公开仓库读取限额。

详见 [作品集中的工程取舍](/writing/portfolio-showcase-2026)。
