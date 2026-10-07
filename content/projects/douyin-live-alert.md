---
name: 抖抖先知
date: 2026-09-30
description: 抖音开播提醒工具：开源的飞书 + Cloudflare 服务，以及可直接使用的微信小程序。
status: active
tags: [open-source, automation, miniprogram]
tech: [TypeScript, Cloudflare Workers, D1, 飞书机器人, 微信小程序]
repo: https://github.com/CrazysCodes/douyin-live-alert
links:
  - label: 开源技术笔记
    url: /writing/douyin-live-alert-serverless
  - label: 小程序复盘
    url: /writing/douyin-live-alert-miniprogram
featured: false
draft: false
problem: 希望及时知道关注的主播是否开播，不必反复打开抖音查看。
contribution: 将本地浏览器轮询演进为 HTTP 状态采集、持久化状态机与可复现的 Serverless 部署流程，并实现微信小程序入口。
result: 跑通定时检查、开播变化识别和通知链路；开源版支持自托管，小程序版可在微信搜索“抖抖先知”使用。
---

## 两条使用路径

- 开源项目：Cloudflare Workers + D1 + 飞书机器人。无需常开本机，运行链路不依赖 Chromium，也不要求登录抖音。
- 微信小程序：在微信搜索“抖抖先知”，添加主播并主动授权一次性订阅消息。通知额度需要用户续订。

开源仓库当前提供的是飞书 + Cloudflare 版，两者不是同一套公开部署代码。

## 工程重点

默认每分钟调度，识别离线到开播或直播间切换的状态变化。首次成功观察建立基线，借助调度租约、有界并发、唯一事件键及失败退避控制重复执行与通知风险。

非官方抖音接口存在变化风险；平台额度与通知链路也会影响提醒时效，不能保证绝对实时。

详见 [开源实践笔记](/writing/douyin-live-alert-serverless) 与 [微信小程序复盘](/writing/douyin-live-alert-miniprogram)。
