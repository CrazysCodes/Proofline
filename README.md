# Proofline

基于 Next.js App Router、TypeScript 与 Markdown 的个人主页、技术博客和作品集模板。

## 开始使用

```sh
npm ci
cp .env.example .env
npm run dev
```

## 功能

- 暖纸色与墨绿视觉、Social / Resume 介绍切换、工作空间卡片及作品滚动预览。
- Markdown 文章、项目与研究资料，分类、标签、归档和正文阅读工具。
- RSS、sitemap、运行时 robots、PNG / ICO / SVG 图标，以及可选的页面浏览量显示。
- 内容目录可独立只读挂载；草稿不会进入文章列表与 RSS。

## 配置与内容

公开配置见 `.env.example`。站点名称、标题、介绍和外部链接从环境读取；生产环境请设置正确的 `SITE_URL` 和 `SITE_TITLE`。

内容位于 `content/posts`、`content/projects`、`content/papers` 和 `content/pages`。本版本全部使用虚构演示资料，不包含个人博客文章、论文、截图、域名验证文件或线上统计数据。修改介绍文案可编辑 `components/home/hero-introduction.tsx` 和工作空间组件；精选作品从 Markdown 中的 `featured` 自动生成。

## 检查与部署

```sh
npm run check:content
npm run check:public
npm run typecheck
npm run build
docker compose up --build -d
```

Docker 提供 standalone 运行方式，内容只读挂载。SVG 图标修改后运行 `node scripts/generate-favicons.cjs` 生成 PNG 与 ICO。浏览量聚合的通用实现与认证示例见 `ops/proofline-analytics`；生产应用自身不暴露真实统计数据，部署者需单独配置。

## 隐私与许可

不要提交真实 `.env`、凭据、备份、日志、数据库或部署记录。公开示例中不存在生产访问凭据；开源不等同于提供生产服务访问权限。当前版本已替换个人内容，但 Git 既有历史中的旧公开版本仍保留，未强制重写历史。

应用代码采用 [MIT](LICENSE)，其他内容范围见 [NOTICE](NOTICE.md)。
