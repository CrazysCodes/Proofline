---
title: 作品集导览：把研究、知识管理和开发者工具做成可运行的产品
date: 2026-08-15
description: 五个已部署产品与一项 OpenCLI 开源贡献的作品集导览，以及它们共同的产品和工程取舍。
tags: [portfolio, ai, developer-tools, local-first, open-source, miniprogram]
category: 作品集
featured: true
draft: false
---

我的作品集目前包括五个已部署产品和一项进入上游版本的开源贡献，方向覆盖研究工作流、个人知识管理、开发者工具、微信小程序、浏览器自动化，以及承载这些成果的公开入口。它们的技术栈并不完全相同，但都在回答同一个问题：怎样把一个真实需求收敛成边界清楚、可以运行、可以验证的产品。[作品集链接](https://proofline.adong.org.cn/writing/portfolio-showcase-2026)

| 项目 | 解决的问题 | 关键技术 | 在线体验 |
| --- | --- | --- | --- |
| Proofline | 组织个人项目、文章和研究材料 | Next.js、TypeScript、Markdown | [proofline.adong.org.cn](https://proofline.adong.org.cn/) |
| Academic Research Agent | 多篇论文的检索、对比和辅助写作 | FastAPI、LangGraph、PostgreSQL、Milvus | [academic.adong.org.cn](https://academic.adong.org.cn) |
| NoteHealth | 检查本地 Markdown 知识库的结构健康度 | Next.js、File System Access API、TypeScript | [notehealth.adong.org.cn](https://notehealth.adong.org.cn) |
| ShipReadme | 基于真实仓库证据诊断和改进 README | Next.js、GitHub REST API、规则引擎 | [shipreadme.adong.org.cn](https://shipreadme.adong.org.cn) |
| 抖抖先知（开源项目 + 微信小程序） | 关注的抖音主播开播时发送提醒 | Cloudflare Workers、D1、飞书机器人；微信小程序、订阅消息 | [开源仓库](https://github.com/CrazysCodes/douyin-live-alert) · [技术笔记](/writing/douyin-live-alert-serverless) |
| OpenCLI / HLTV | 把 CS2 赛事与选手数据变成结构化 CLI 命令 | JavaScript、Browser Bridge、DOM 解析 | [上游 PR #2028](https://github.com/jackwener/OpenCLI/pull/2028) |

这些实践处于不同阶段：抖抖先知与 Proofline 是当前精选产品；NoteHealth、ShipReadme 已归档，Academic Research Agent 暂时挂起；OpenCLI 则是一项开源贡献。这里展示每项工作已经跑通的核心链路，以及我在范围、隐私、可信度、开源协作和部署上的取舍。

| Proofline | Academic Research Agent |
| :---: | :---: |
| [![Proofline 首页与精选项目](/images/articles/proofline-home-thumb.png)](/images/articles/proofline-home.png) | [![Academic Research Agent 首页](/images/articles/academic-research-agent-thumb.png)](/images/articles/academic-research-agent.png) |
| NoteHealth | ShipReadme |
| [![NoteHealth 本地优先知识库体检首页](/images/articles/notehealth-home-thumb.png)](/images/articles/notehealth-home.png) | [![ShipReadme 仓库诊断首页](/images/articles/shipreadme-home-thumb.png)](/images/articles/shipreadme-home.png) |

*以上截图记录了各项目当时的界面，点击缩略图可以查看原图。*

## Proofline：让作品集本身也成为证据

[Proofline](https://proofline.adong.org.cn/) 是当前这个站点，也是整个作品集的公共入口。它把个人主页、技术文章、项目复盘和研究资料组织在同一个只读系统中。

第一版刻意没有后台、登录、数据库和在线编辑器。文章与项目使用 Markdown 维护，Next.js 在运行时读取内容目录并渲染页面；服务器只需要把真实内容目录以只读方式挂载到容器中，上传 Markdown 后刷新即可展示。

```text
Markdown 内容目录
  -> Next.js App Router 运行时读取
  -> remark / rehype 渲染
  -> Writing / Projects / Research / Tags / RSS
```

这个项目最重要的设计不是页面数量，而是维护模型：内容与应用镜像分离、没有公网写入口、格式可迁移。它让作品集不依赖某个平台，也让几年后的自己仍然能直接理解和接管。

## Academic Research Agent：把论文阅读变成可追踪的工作流

[Academic Research Agent](https://academic.adong.org.cn) 面向需要同时阅读和比较多篇论文的研究者。它覆盖从文件上传、内容解析、向量检索到多文档分析和报告优化的核心链路。

> **当前状态：Hold（暂时挂起）。** 在完成原型和核心链路验证后，我发现继续把它扩展成完整产品，实际效果未必会明显优于“Codex + 学术研究 Skill”的组合。考虑到两者在能力上的重叠，以及继续投入所需的维护成本，我暂时搁置了后续开发，保留现有系统作为技术验证和未来重新评估的基础。

系统将论文元数据保存到 PostgreSQL，将切块后的正文写入 Milvus。用户可以围绕已选论文进行 RAG 问答，也可以启动由 LangGraph 编排的多 Agent 分析：

```text
Planner
  -> 拆解研究问题
Retriever
  -> 组织全文或向量检索上下文
Writer
  -> 生成结构化报告
Reviewer
  -> 评分，必要时打回重写
```

前端使用 Next.js，后端使用 FastAPI，通过 SSE 返回节点进度和分析正文。这个项目关注的不只是“模型能否回答”，还包括文献来源、上下文范围、分析历史和重写过程是否可追踪。

## NoteHealth：不上传笔记的知识库体检

[NoteHealth](https://notehealth.adong.org.cn) 是一个本地优先的 Markdown 知识库健康检查工具。用户在浏览器中选择一个本地目录，应用读取其中的 Markdown 文件，分析链接、标签、结构、内容厚度和更新时间。

它围绕五个维度生成健康报告：

- Connectivity：孤岛笔记和断链。
- Freshness：长期未更新的内容。
- Structure：标题与目录组织。
- Tags：重复、稀疏或混乱的标签。
- Depth：过薄、缺少上下文的笔记。

这个项目最关键的产品边界是“内容留在用户设备上”。它不要求登录，不上传笔记，不接数据库，也不会自动修改文件。服务器只提供 Web 应用，文件读取与分析发生在浏览器内存中。

对知识管理工具来说，隐私不是附加功能，而是架构的起点。

## ShipReadme：只根据仓库中真实存在的内容提出建议

[ShipReadme](https://shipreadme.adong.org.cn) 是一个开源、自部署的 README 诊断工具。用户输入公开 GitHub 仓库地址后，系统读取默认分支的文件树和关键文件，检查 Quick Start、配置、测试、部署、许可证、贡献指南和截图等信号。

它会输出三类结果：

1. README Readiness Score。
2. 每个问题对应的仓库证据和修复计划。
3. 一份可以复制的 Markdown 改进草案。

这个项目坚持一条约束：不编造仓库中不存在的命令。如果没有测试脚本，就不会补一个看似专业但无法运行的测试步骤；如果没有 Dockerfile，也不会声称项目支持 Docker 部署。

相比“让 AI 写得更像 README”，ShipReadme 更关注输出是否能被代码仓库本身证明。

## 抖抖先知：开源提醒服务与微信小程序

抖抖先知围绕“关注的主播开播时及时收到提醒”提供两条使用路径：不想部署的人可以在微信搜索“抖抖先知”小程序；希望自托管的人可以使用 [douyin-live-alert 开源项目](https://github.com/CrazysCodes/douyin-live-alert)，通过 Cloudflare Workers + D1 定时轮询，并由飞书机器人发送私聊提醒。

开源仓库当前主线是飞书 + Cloudflare 版，不代表微信小程序代码也已公开。默认每分钟调度，单次状态检查通常数秒完成；提醒时效还受接口响应、重试和消息平台影响，不承诺绝对实时。两条路径共同关注状态变化识别、通知去重与持续运行，微信版还需要处理一次性订阅消息授权额度。

开源版的设计与部署思路见：[从本地轮询到 Serverless：抖抖先知的开源实践](/writing/douyin-live-alert-serverless)。

这个项目跑通了主播链接解析、多用户订阅、状态采集、微信消息授权、通知额度和低资源服务器部署的完整链路，也处理了“一次点击只能触发一次有效订阅请求”等平台约束。完整实现与踩坑记录见：[从轮询抖音到微信提醒：我做了一个“抖抖先知”小程序](/writing/douyin-live-alert-miniprogram)。

## OpenCLI / HLTV：把个人需求贡献成公共能力

[OpenCLI](https://github.com/jackwener/OpenCLI) 把网站、浏览器会话和 Electron 应用组织成适合人和 AI Agent 使用的确定性命令行接口。我通过 [PR #2028](https://github.com/jackwener/OpenCLI/pull/2028) 向上游贡献了一组 HLTV 适配器，并随 v1.8.6 发布。

这组适配器包含 13 个只读命令，覆盖 HLTV 搜索、选手状态、近期比赛、地图池、选手对比、单图数据、系列赛、战队和赛事分析。由于 HLTV 没有为这些视图提供稳定的公开 JSON API，实现通过 OpenCLI Browser Bridge 读取渲染后的页面，再将多种 URL、DOM 表格和统计字段归一化为稳定输出。

这项贡献让我完成了从个人需求、适配器设计、文档到上游合并的完整开源协作闭环。更详细的实现与使用方式见：[给 OpenCLI 贡献 HLTV 适配器](/writing/opencli-hltv-contribution)。

## 这些项目与开源贡献背后的共同方法

这些工作表面上分别属于博客、AI、知识管理、开发者工具和浏览器自动化，但实现时遵循了几条共同原则。

### 先定义不做什么

MVP 最容易失控的原因，是把所有可能的能力都放进第一版。NoteHealth 不做云同步，ShipReadme 不自动创建 PR，Proofline 不做 CMS，Academic Research Agent 也没有把所有研究活动都塞进单一聊天框。明确边界后，核心链路才容易做完整。

### 输出必须有证据

Research Agent 的回答要能回到论文上下文，ShipReadme 的建议要能回到仓库文件，NoteHealth 的问题要指出具体笔记或链接，Proofline 的个人介绍则要落到项目、文章和研究材料。

“看起来合理”不等于可信；能够追溯输入、规则和结果，才是这些工具共同追求的质量。

### 把隐私和运维放进设计

本地优先工具尽量让数据停留在浏览器；需要服务端状态的系统则明确数据库和密钥边界。线上项目统一使用 Docker 与 Nginx 部署，配置由环境变量注入，应用与持久化数据分离。

### 交付一个可以访问的闭环

我希望作品集不只是代码仓库列表。每个项目都尽量包含清楚的问题定义、可运行的核心流程、公开演示入口和部署边界。代码实现、产品说明与线上状态共同组成证据链。

## 接下来

下一阶段会继续补充真实使用数据、失败案例和更深入的工程复盘，而不是只扩展功能列表。对我来说，作品集最有价值的部分不是证明“会多少技术”，而是展示如何在限制条件下做取舍，并把一个想法推进到可以被别人验证的状态。

完整项目列表可以在 [Projects](/projects) 查看，后续的技术拆解和迭代记录会继续发布在 [Writing](/writing)。
