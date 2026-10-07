---
title: 给 OpenCLI 贡献 HLTV 适配器：把电竞数据变成可组合的命令行工具
date: 2026-08-15
description: 分享 OpenCLI 的浏览器自动化思路、我通过 PR #2028 贡献 HLTV 分析命令的过程，以及进一步沉淀 hltv-analyst Skill 的实践。
tags: [opencli, open-source, hltv, browser-automation, cs2, codex-skill]
category: 开源贡献
featured: true
draft: false
---

最近我向开源项目 [OpenCLI](https://github.com/jackwener/OpenCLI) 提交了一组 HLTV 适配器。这项贡献通过 [PR #2028](https://github.com/jackwener/OpenCLI/pull/2028) 合并进上游，并随 OpenCLI v1.8.6 发布。

这次贡献的出发点并不是“给网页再套一层命令行”，而是把分散在 HLTV 多种页面中的 CS2 赛事数据，整理成结构稳定、可以组合、适合人和 AI Agent 重复调用的命令。

## OpenCLI 是什么

OpenCLI 的目标是把网站、已登录的浏览器会话、Electron 应用和本地工具统一成命令行接口。

对于已经有适配器的网站，用户不需要每次让模型重新理解页面、寻找按钮和组织输出，而是可以直接执行确定性的命令：

```bash
opencli hackernews top --limit 5
opencli bilibili hot --limit 5
opencli hltv player-form --player 19230/m0nesy --limit 30
```

OpenCLI 通过 Browser Bridge 复用 Chrome 当前的页面和登录状态。账号凭据继续留在浏览器中，命令只读取或操作对应页面，不需要把 Cookie 和密码复制给脚本。

它提供两层能力：

- 已知网站使用预先实现的适配器，获得快速、结构稳定的结果。
- 未知页面使用 `opencli browser` 的导航、点击、输入、提取和网络观察原语，让 AI Agent 完成探索或辅助开发新适配器。

这个设计很适合重复任务。LLM 可以负责理解用户意图和选择命令，而具体执行交给可测试、可复用的适配器，不需要每一次都重新支付页面理解和推理成本。

## 为什么选择 HLTV

HLTV 是 CS2 / CS:GO 赛事、比赛和选手数据的重要公开入口。一个常见分析问题往往需要在多个页面之间跳转：

- 一名选手最近的状态怎样？
- 两名选手在共同地图样本中的表现谁更好？
- 某支队伍的地图池强弱如何？
- 一轮 BO3 每张地图的选手数据有什么变化？
- 某项赛事已经产生了哪些统计比赛？

HLTV 没有为这些视图提供稳定的公开 JSON API，因此适配器需要通过 OpenCLI 的浏览器桥接读取渲染后的页面，再把 DOM 中的表格、链接和统计字段还原为结构化数据。

这正好是 OpenCLI 擅长的场景：目标网站明确、任务会重复执行、输出模式相对稳定，但直接手动浏览和复制数据的成本很高。

## 我贡献了什么

这次提交新增了 13 个只读命令，覆盖四类分析路径。

### 搜索与实体定位

```bash
opencli hltv search niko --limit 5
```

搜索选手、战队、赛事和文章，并返回后续命令可以继续使用的实体链接或标识。

### 选手分析

```bash
opencli hltv player-summary --player 3741/niko
opencli hltv player-matches --player 3741/niko --limit 10 -f json
opencli hltv player-form --player 19230/m0nesy --limit 30
opencli hltv player-map-pool --player 19230/m0nesy
opencli hltv player-vs-team 6667/falcons --player 19230/m0nesy
opencli hltv player-teammate-impact 19230/m0nesy 3741/niko
opencli hltv player-duel 3741/niko 21167/donk
```

这组命令不仅读取单页数据，还会对最近地图样本进行聚合，按地图、对手和共同参赛样本组织结果。`player-duel` 可以比较两名选手在共同地图中的表现，并在页面数据可用时补充直接击杀关系。

### 比赛与系列赛

```bash
opencli hltv match-map \
  "https://www.hltv.org/stats/matches/mapstatsid/231594/falcons-vs-natus-vincere"

opencli hltv match-series \
  "https://www.hltv.org/stats/matches/126993/spirit-vs-falcons"
```

`match-map` 读取一张地图中的全部选手统计；`match-series` 则把 BO1、BO3 或 BO5 展开为系列赛摘要、地图结果和选手数据，减少手动逐页打开 mapstats 的工作。

### 战队与赛事

```bash
opencli hltv team-matches 6667/falcons --limit 10
opencli hltv team-map-pool 11283/falcons
opencli hltv event-matches 8301 --limit 10
```

这组命令分别读取战队近期地图结果、可见地图池数据和赛事统计比赛列表，可以作为赛前分析、复盘或进一步数据处理的入口。

在 Git 历史中，这次初始贡献涉及 20 个文件、约 3,139 行新增内容，包括适配器实现、公共解析工具、命令注册和使用文档。它不是一个只覆盖单页的抓取脚本，而是一组能够共享输入解析、页面读取和统计逻辑的完整命令面。

## 实现中最重要的几个问题

### 接受多种输入，而不是只接受一种 URL

真实使用中，人们会复制选手的普通页面、stats 页面、比赛页、mapstats 页或只提供 `id/slug`。适配器需要先判断实体类型，再归一化成内部引用；如果把输入格式写死，命令虽然能演示，却很难进入日常工作流。

### 让输出适合继续处理

终端表格适合人快速阅读，JSON 则适合脚本和 AI Agent 消费。因此命令输出使用扁平、稳定的字段结构，并保留选手、战队、比赛和地图的关键标识：

```bash
opencli hltv player-matches --player 3741/niko --limit 20 -f json
```

结果可以继续交给 `jq`、统计脚本、定时任务，或者由 Agent 组合成更高层的分析流程。

### 多页任务必须承认成本

搜索和选手摘要通常只读取一个页面；系列赛展开、选手对比等命令可能需要加载多个 HLTV 页面。适配器没有把两者伪装成相同成本，而是在文档中明确说明重型命令会更慢，并允许使用 `--limit`、地图和时间范围等过滤条件缩小工作量。

### 对页面变化给出可诊断的错误

网页适配器最大的长期风险是页面结构发生变化。参数无效、页面没有数据、DOM 形状不符合预期和浏览器超时，应该是不同的错误，而不是统一返回空数组。HLTV 适配器为这些情况分别使用参数错误、空结果、命令执行错误和超时错误，让后续修复能从错误类型开始定位。

## 从适配器继续沉淀：hltv-analyst Skill

把 HLTV 适配器贡献给 OpenCLI 之后，我又把使用过程中反复出现的分析方法整理成了一个独立项目：[CrazysCodes/hltv-analyst](https://github.com/CrazysCodes/hltv-analyst)。它不只是保存几条命令，而是把“获取事实”和“解释事实”拆成了两层：

- OpenCLI 数据层从 HLTV 可见页面提取比分、地图、Rating、K-D、ADR、KAST、互杀关系和地图池等结构化事实。
- `hltv-analyst` Skill 负责在事实之上完成中文分析，例如选手对位、BO3 复盘、近期状态、球探报告和冷门候选判断。

有了这层 Skill，我不必每次重新告诉 Agent 应该先查什么、怎样控制样本范围、如何区分直接互杀与整体表现，也不用重复声明结论必须附带证据。它把这些分析纪律变成了可复用的工作流。

例如，可以直接提出更接近真实观赛和赛前分析的问题：

- “帮我复盘这场 BO3，指出胜负转折和关键选手。”
- “NiKo 和 donk 上次交手谁压谁？”
- “给我一份 m0NESY 最近 50 图的球探报告。”
- “这个赛事里有没有数据层面的冷门候选？”

这里最重要的边界是：CLI 只负责事实，Skill 才负责解释。像“软脚”“硬脚”、carry 或低迷这样的说法只能作为分析标签，必须同时给出数据证据、样本量限制和置信度，不能伪装成客观字段。

仓库同时保留了 HLTV adapters、站点验证记忆和项目级 Codex Skill，既可以研究适配器实现，也可以把 `.agents/skills/hltv-analyst/` 安装为全局 Skill。完整安装和验证方式见项目的[中文 README](https://github.com/CrazysCodes/hltv-analyst/blob/main/README.zh-CN.md)。

## 怎样开始使用 OpenCLI

OpenCLI 当前可以通过 npm 安装：

```bash
npm install -g @jackwener/opencli
```

浏览器类适配器还需要安装 Browser Bridge 扩展。安装完成后先运行诊断：

```bash
opencli doctor
opencli list
opencli hltv --help
```

HLTV 适配器是只读的，不要求登录 HLTV。如果网站出现 Cloudflare 或人工验证页面，需要先在 Chrome 中完成验证，再重新执行命令。

OpenCLI 最适合以下任务：

- 已有适配器的网站，需要重复、稳定地读取或操作。
- 需要复用浏览器登录状态，又不希望导出账号凭据。
- 希望把网页能力接入 shell、定时任务或 AI Agent。
- 同一个任务会运行很多次，值得从一次性页面操作沉淀成适配器。

如果只是探索一个完全未知的网站，通用 Browser Use 工具会更灵活；当流程稳定并开始重复时，再把它写成 OpenCLI 适配器，通常能获得更好的速度、可测试性和输出一致性。

## 从使用者到贡献者

这次贡献让我更明确地看到，网页自动化的价值并不只在“成功点到某个按钮”。真正可复用的适配器还需要处理输入契约、输出结构、页面变化、错误语义、性能成本和文档。

PR #2028 被合并进上游，并在 v1.8.6 发布说明中列为 `@CrazysCodes` 的首次贡献。对我来说，这比维护一个只在本机运行的脚本更有意义：一次个人需求最终变成了所有 OpenCLI 用户都可以发现、调用和继续组合的公共能力。

相关链接：

- [OpenCLI GitHub 仓库](https://github.com/jackwener/OpenCLI)
- [HLTV 适配器贡献 PR #2028](https://github.com/jackwener/OpenCLI/pull/2028)
- [OpenCLI v1.8.6 发布记录](https://github.com/jackwener/OpenCLI/releases/tag/v1.8.6)
- [HLTV 适配器文档](https://github.com/jackwener/OpenCLI/blob/main/docs/adapters/browser/hltv.md)
- [hltv-analyst：OpenCLI 适配器与 Codex 分析 Skill](https://github.com/CrazysCodes/hltv-analyst)
