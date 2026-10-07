---
name: NoteHealth
date: 2026-06-02
description: 本地优先的 Markdown 知识库体检，在浏览器内分析链接、标签、结构和新鲜度。
status: archived
tags: [markdown, knowledge-base, local-first]
tech: [Next.js, React, TypeScript, Markdown, Docker]
repo: https://github.com/CrazysCodes/NoteHealth
demo: https://notehealth.adong.org.cn
featured: false
draft: false
---

## 当前状态

已归档。保留项目介绍与代码，作为一次产品实践的记录。

## 解决的问题

长期积累的笔记容易出现孤岛、断链、重复标签和结构混乱。NoteHealth 在浏览器内读取用户选择的 Markdown 文件夹，输出健康报告、问题证据与整理建议。

## 核心流程

本地目录选择 → 解析 Markdown、Wiki 链接与标签 → 从连接、新鲜度、结构、标签、内容厚度五个维度分析 → 生成问题列表与可导出的 Markdown 报告。

不要求登录，不上传笔记，不接数据库，不自动修改文件，也不提供云同步或团队协作。服务器只提供 Web 应用，笔记分析发生在用户设备上。

详见 [作品集中的产品介绍](/writing/portfolio-showcase-2026)。
