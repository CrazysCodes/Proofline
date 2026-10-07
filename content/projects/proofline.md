---
name: Proofline
date: 2026-05-26
description: 一个以 Markdown 为内容源的开源个人主页，连接文章、作品与研究。
status: open-source
tags: [nextjs, markdown, portfolio]
tech: [Next.js, TypeScript, Markdown]
repo: https://github.com/CrazysCodes/Proofline
demo:
featured: true
draft: false
---

## 项目目标

Proofline 用来承载个人公开信息、技术文章、项目作品、研究和论文入口。

项目采用开源方式维护，代码入口见 [GitHub 仓库](https://github.com/CrazysCodes/Proofline)。

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
