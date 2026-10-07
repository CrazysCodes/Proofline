# Adong / Proofline

以 Markdown 为内容源的个人主页、技术博客、作品集与研究入口。Next.js App Router 负责运行时渲染；内容目录可以独立只读挂载，不需要后台 CMS。

## 本地开发

```powershell
npm ci
npm run dev
npm run typecheck
npm run build
```

复制 `.env.example` 配置公开站点信息；不要提交 `.env`。内容分别放在 `content/posts`、`content/projects`、`content/papers` 和 `content/pages`，`draft: true` 的文章不会发布。

## 当前内容结构

- 精选作品：抖抖先知、OpenCLI 开源贡献与 Proofline；NoteHealth、ShipReadme 已归档，Academic Research Agent 暂时 Hold。
- 文章：项目复盘、开源贡献、Serverless 技术笔记与 Coding Agent 随笔。
- 研究：HAS-DETR 论文及 PDF / DOI。
- 设计：暖纸色与墨绿、衬线标题、主页工作空间与作品滚动预览；列表保留筛选、不提供搜索框，正文包含阅读工具，研究页保留静态展示。

公开站点：[proofline.adong.org.cn](https://proofline.adong.org.cn)。

## 部署注意

Docker 使用 standalone 构建。构建上下文排除 `.env`、Git 历史和本地依赖；部署前保留旧镜像、旧 release 路径与内容备份，只重建 Proofline 服务。内容同步采用显式文件清单，不删除服务器独有文件。

服务器现有 Compose 使用 `proofline` 服务与 `127.0.0.1:3010` 入口，本仓库的 `compose.yaml` 仅供独立本地部署，不应覆盖服务器统一 Compose。

统计服务独立运行，部署网页不应修改分析数据、定时任务或 `/analytics/` 的 Basic Auth。部署后验证主要页面、新文章、项目页、截图资源，以及统计入口仍返回未认证的 401。

## 复用与隐私

`.env.example` 仅包含公开配置示例。请使用自己的站点地址、作者信息、备案信息和外部链接，不要提交真实 `.env`、密钥、统计数据库、原始日志或认证文件。

应用代码采用 [MIT License](LICENSE)。`content/` 与 `public/images/` 是这个个人站点的公开内容，并非通用模板素材，不在 MIT 授权范围内；复用时请替换文章、论文元信息和截图。详见 [许可范围说明](NOTICE.md)。

`/analytics/views.json` 在本地开发中返回演示数据；生产环境由 Nginx 提供仅包含页面路径、累计浏览量和更新时间的公开汇总，完整报表保持认证保护。
