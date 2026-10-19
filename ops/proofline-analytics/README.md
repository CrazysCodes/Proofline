# Proofline Analytics

Proofline 的轻量、第一方页面访问统计：

- Nginx 将 Proofline 请求写入独立 JSON 日志。
- Python 标准库增量计算每个页面的 PV 和每日 UV。
- systemd timer 每小时更新 SQLite 数据和静态 HTML 报表。
- Nginx 日志轮转前再聚合一次，避免遗漏尾部请求。

## 统计边界

只统计返回 `200 text/html` 的真实 `GET` 页面请求。静态资源、API、RSS、重定向、爬虫、健康检查、Next.js RSC 和预加载请求会被排除。

UV 使用 `日期 + IP + User-Agent` 的 HMAC 结果估算。HMAC 密钥和数据库权限为 `0600`；原始 IP 只存在于权限为 `0640`、最多保留 14 天的 Nginx 日志中。

## 服务器路径

| 内容 | 路径 |
| --- | --- |
| 聚合脚本 | `/srv/services/apps/proofline-analytics/aggregate.py` |
| 数据库 | `/srv/services/data/proofline-analytics/analytics.sqlite3` |
| Basic Auth 报表 | `https://analytics.example.com/analytics/` |
| HTML 文件 | `/srv/services/data/proofline-analytics/report/index.html` |
| JSON 数据 | `/srv/services/data/proofline-analytics/report/data.json` |
| 公开浏览量 | `https://analytics.example.com/analytics/views.json` |
| 原始日志 | `/var/log/nginx/proofline-analytics.log` |

报表通过 Nginx 的精确 `/analytics/` 路径提供，并使用独立的 HTTP Basic Auth 密码文件保护。响应包含 `Cache-Control: no-store` 和 `X-Robots-Tag: noindex, nofollow, noarchive`。

另一个精确路径 `/analytics/views.json` 无需认证，只提供更新时间和各页面累计 PV，用于站点页脚显示“本页浏览量”。它不包含 UV、每日明细、访客标识或原始日志。将 `proofline-analytics-location.conf` 中的路径配置放入 Proofline 站点的 Nginx server 配置。SQLite、访客密钥、完整 JSON 数据和原始日志仍不可通过该路径访问。

浏览量每小时聚合一次；当前口径只计入 Nginx 返回的 HTML 页面请求，Next.js 站内客户端跳转不会被计入。

`example.com` 也接入同一份公开浏览量数据：在该域名的 HTTPS server 中增加精确 `/analytics/views.json` 路由，并在日志配置的 `$proofline_analytics_enabled` map 中启用 `example.com`。两个域名按页面路径合并统计，不重复复制历史数据。认证报表仍保留在 `analytics.example.com/analytics/`，主域名不额外开放报表或完整数据。主域名接入前未写入独立统计日志的访问，不自动补算。

## 验证

```bash
python3 aggregate.py --self-test
nginx -t
systemctl status proofline-analytics.timer
systemctl start proofline-analytics.service
```

首次安装时，将本目录上传到服务器，然后以 root 执行：

```bash
./install.sh /path/to/proofline-analytics
```

安装脚本拒绝覆盖已有目标；如果 Nginx 或 systemd 安装失败，会移除本次新增的服务配置并重新加载原 Nginx 配置。数据目录不会在回滚时自动删除。
