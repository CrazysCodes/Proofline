---
name: Academic Research Agent
date: 2026-06-02
description: 论文上传、检索问答与多文档分析原型，目前 Hold，暂缓继续开发。
status: archived
tags: [rag, langgraph, research-agent]
tech: [Next.js, FastAPI, Python, LangGraph, PostgreSQL, Milvus, Docker]
repo: https://github.com/CrazysCodes/academic-research-agent
demo: https://academic.adong.org.cn
featured: false
draft: false
---

## 当前状态：Hold

原型与核心链路已经验证，后续产品开发暂时挂起。我认为继续投入的效果未必会明显优于“Codex + 学术研究 Skill”，而两者能力重叠、独立产品维护成本更高。这是阶段性的产品取舍，不是经过严格测评后的能力结论；现有成果保留作为技术验证与未来重新评估的基础。

## 已跑通的链路

PDF / Word 上传与解析 → PostgreSQL 保存论文元数据 → Milvus 保存正文向量 → 基于已选论文的 RAG 问答与通用问答降级 → 多文档分析和历史记录。

LangGraph 编排 Planner、Retriever、Writer、Reviewer，支持评分与报告重写；Next.js 前端通过 FastAPI 与 SSE 获取节点进度和流式正文，可选 Tavily 搜索补充外部资料。

## 部署边界

前后端以 Docker 部署，复用服务器现有 PostgreSQL、Redis 和 Milvus。模型密钥、向量与数据库配置由环境变量注入，不进入公开文档。

相关取舍见 [作品集](/writing/portfolio-showcase-2026) 与 [我对 Harness 的理解](/writing/human-as-harness)。
