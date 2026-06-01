---
name: Proofline
date: 2026-05-26
description: 一个只读的个人主页、博客、作品集与研究入口。
status: building
tags: [nextjs, markdown, portfolio]
tech: [Next.js, TypeScript, Markdown]
repo: https://github.com/CrazysCodes/Proofline
demo:
featured: true
draft: false
---

## 项目目标

Proofline 用来承载个人公开信息、技术文章、项目作品、研究和论文入口。

第一版坚持只读模式：

- 不做后台
- 不做登录
- 不接数据库
- 不开放上传接口
- 内容目录由服务器文件系统维护

## 技术路径

```text
Next.js App Router
  -> 运行时读取 content
  -> remark / rehype 渲染 Markdown 原生语法
  -> Docker 只读挂载内容目录
```

## 部署边界

容器只读取 `/app/content`，生产服务器把真实内容目录只读挂载进容器。
