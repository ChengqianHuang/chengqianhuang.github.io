---
title: 给博客加点炫技元素
date: 2026-09-25
---

博客 v2 上线。原则不变：免构建、零依赖，所有效果原生 JS 手写，同时尊重系统偏好。

## 新增了什么

### 1. 粒子网络背景

`particles.js`，约 90 行：

- Canvas 固定在 `z-index: -1`，`pointer-events: none`，不拦截任何交互
- 鼠标移动时附近粒子被轻微吸引，距离内粒子之间连线，透明度随距离衰减
- 细节：粒子速度加阻尼（`vx *= 0.995`）防止吸引累积导致加速失控；`visibilitychange` 时停帧省电；`prefers-reduced-motion` 下完全不启动

### 2. 打字机 intro

首页文案逐字打出，带闪烁光标。`prefers-reduced-motion` 时直接显示全文。

### 3. 明暗主题手动切换

- `<head>` 内联脚本在任何渲染前设置 `data-theme`，**无闪烁**（FOUC）
- 默认跟随系统 `prefers-color-scheme`，手动切换后写入 `localStorage`，之后以手动选择为准
- 粒子颜色通过 `getComputedStyle` 读当前主题，切换时同步变色

### 4. 代码语法高亮

文章页引入 highlight.js（唯一的外部 CDN 依赖，marked 之外）。亮/暗两套样式表随主题切换 disable/enable；CDN 加载失败时静默降级为纯文本代码块，文章照常可读。

### 5. 阅读进度条 + 返回顶部

- 文章页顶部 3px 进度条，随滚动增长
- 下滑超过 400px 出现返回顶部按钮，毛玻璃背景

## 没做什么

- 没有动画库（GSAP / anime.js）——几个效果原生实现总共 150 行
- 没有框架化——站点仍然是 HTML + CSS + 几个独立脚本
- 没有破坏可读性——所有动画都是低透明度、低干扰的背景层

炫技的正确姿势是让人看到效果后打开 DevTools 发现就几个文件，而不是被 2MB 的 bundle 劝退。
